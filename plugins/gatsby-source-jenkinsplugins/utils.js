/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const URL = require('url');
const axiosRetry = require('axios-retry');
const dateFNs = require('date-fns');
const {parseStringPromise} = require('xml2js');
const categoryList = require('./categories.json');

axiosRetry(axios, {retries: 3});

const requestGET = ({url, reporter}) => {
    const activity = reporter.activityTimer(`Fetching '${url}'`);
    activity.start();

    return axios
        .get(url)
        .then((results) => {
            activity.end();

            if (results.status !== 200) {
                throw results.data;
            }
            return results.data;
        });
};

function getContentFromConfluencePage(url, content) {
    const $ = cheerio.load(cheerio.load(content)('.wiki-content').html());

    $('.conf-macro.output-inline th:contains("Plugin Information")').parents('table').remove();

    // Remove any table of contents
    $('.toc').remove();
    // remove jira issue table
    $('.jira-table.conf-macro.output-block').remove();

    // remove jira issue list
    $('.jira-issues').remove();

    // Replace href/src with the wiki url
    $('[href]').each((idx, elm) => {
        $(elm).attr('href', URL.resolve(url, $(elm).attr('href')));
    });
    $('[src]').each((idx, elm) => {
        $(elm).attr('src', URL.resolve(url, $(elm).attr('src')));
    });
    return ($('body') || $).html();
}

const shouldFetchPluginContent = (id) => {
    if (process.env.GET_CONTENT_SINGLE && process.env.GET_CONTENT_SINGLE === id) {
        return true;
    }
    if (!process.env.GET_CONTENT) {
        return false;
    }
    return true;
};


const pluginWikiUrlRe = /^https?:\/\/wiki.jenkins(?:-ci.org|.io)\/display\/(?:jenkins|hudson)\/([^/]*)\/?$/i;
const getPluginContent = async ({plugin, reporter}) => {
    plugin.id = plugin.id || plugin.name;
    plugin.wiki = plugin.wiki || {};
    // absolutely required fields
    plugin.wiki.content = plugin.wiki.content || '';
    plugin.wiki.url = plugin.wiki.url || '';

    if (!shouldFetchPluginContent(plugin.id)) {
        return plugin;
    }
    let matches;
    if ((matches = pluginWikiUrlRe.exec(plugin.wiki.url)) != null) {
        try {
            return await requestGET({
                reporter,
                url: `https://wiki.jenkins.io/rest/api/content?expand=body.view&title=${matches[1]}`
            }).then(async data => {
                const result = data.results.find(result => plugin.wiki.url.includes(result._links.webui)) || data.results[0];
                plugin.wiki.content = await getContentFromConfluencePage(
                    'https://wiki.jenkins.io/',
                    `<body class="wiki-content">${result.body.view.value}</body>`);
                return plugin;
            });
        } catch (e) {
            console.error(`Error fetching wiki content for ${plugin.name}`, e);
        }
    }

    return requestGET({reporter, url: `https://plugins.jenkins.io/api/plugin/${plugin.name}`}).then(data => {
        plugin.wiki.content = data.wiki.content || '';
        return plugin;
    });
};

const fetchPluginData = async ({createNode, reporter, firstReleases}) => {
    const sectionActivity = reporter.activityTimer('fetch plugins info');
    sectionActivity.start();
    const promises = [];
    let page = 1;
    let pluginsContainer;
    const names = [];
    const pipelinePluginsUrl = 'https://www.jenkins.io/doc/pipeline/steps/contents.json';
    const pipelinePluginIds = await requestGET({url: pipelinePluginsUrl, reporter});
    const bomDependencies = await fetchBomDependencies(reporter);
    const updateUrl = 'https://updates.jenkins.io/update-center.actual.json';
    const updateData = await requestGET({url: updateUrl, reporter});
    const detachedUrl = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/core/src/main/resources/jenkins/split-plugins.txt';
    const detachedPluginsData = await requestGET({url: detachedUrl, reporter});
    const detachedPlugins = detachedPluginsData.split('\n')
        .filter(row => row.length && !row.startsWith('#')).map(row => row.split(' '));
    for (const deprecation of Object.keys(updateData.deprecations)) {
        updateData.plugins[deprecation] && updateData.plugins[deprecation].labels.push('deprecated');
    }
    do {
        const url = `https://plugins.jenkins.io/api/plugins/?limit=100&page=${page}`;
        pluginsContainer = await requestGET({url, reporter});
        for (const plugin of pluginsContainer.plugins) {
            const pluginName = plugin.name.trim();
            names.push(pluginName);
            const pluginUC = updateData.plugins[pluginName];
            pluginUC.developers.forEach(maint => {maint.id = maint.developerId, delete(maint.developerId);});
            pluginUC.scm = fixGitHubUrl(pluginUC.scm, pluginUC.defaultBranch || 'master');
            promises.push(getPluginContent({plugin, reporter}).then(pluginData => {
                const p = createNode({
                    ...pluginUC,
                    stats: pluginData.stats,
                    wiki: pluginData.wiki,
                    securityWarnings: updateData.warnings.filter(p => p.name == pluginName)
                        .map(w => checkActive(w, pluginUC)),
                    dependencies: getImpliedDependenciesAndTitles(pluginUC, detachedPlugins, updateData),
                    firstRelease: firstReleases[pluginName].toISOString(),
                    id: pluginName,
                    hasPipelineSteps: pipelinePluginIds.includes(pluginName),
                    hasBomEntry: !!bomDependencies.find(artifactId => pluginUC.gav.includes(`:${artifactId}:`)),
                    parent: null,
                    children: [],
                    internal: {
                        type: 'JenkinsPlugin',
                        contentDigest: crypto.createHash('md5').update(`plugin${pluginName}`).digest('hex')
                    }
                });
                if (!p || !p.then) {
                    if (process.env.GATSBY_SENTRY_DSN) {
                        const Sentry = require('@sentry/node');
                        Sentry.init({
                            dsn: process.env.GATSBY_SENTRY_DSN
                        });
                        Sentry.captureMessage(new Error(`Error creatingNode for plugin: ${pluginName}`), {extra: {pluginData: pluginData, p: p}});
                    }
                    console.log('p', p, plugin);
                    return new Error('no promise returned');
                }
                p.then(() => {
                    return Promise.all(pluginUC.developers.map(maintainer => {
                        return createNode({
                            ...maintainer,
                            internal: {
                                type: 'JenkinsDeveloper',
                                contentDigest: crypto.createHash('md5').update(maintainer.id).digest('hex')
                            }
                        });
                    }));
                });
                return p.then(() => {
                    return Promise.all(pluginData.dependencies.map(dependency => {
                        const mergedId = `${pluginName}:${dependency.name.trim()}`;
                        return createNode({
                            ...dependency,
                            dependentTitle: pluginUC.title,
                            dependentName: pluginUC.name,
                            id: mergedId,
                            internal: {
                                type: 'JenkinsPluginDependency',
                                contentDigest: crypto.createHash('md5').update(`dep${mergedId}`).digest('hex')
                            }
                        });
                    }));
                });
            }));
        }
        await Promise.all(promises);
        page = pluginsContainer.page + 1;
    } while (!page || pluginsContainer.page < pluginsContainer.pages);
    await Promise.all(promises);
    await fetchSuspendedPlugins({updateData, names, createNode});
    sectionActivity.end();
};

const getImpliedDependenciesAndTitles = (plugin, detachedPlugins, updateData) => {
    for (const detached of detachedPlugins) {
        const [detachedPlugin, detachedCore, detachedVersion] = detached;
        if (versionToNumber(detachedCore) > versionToNumber(plugin.requiredCore)) {
            plugin.dependencies.push({name: detachedPlugin,
                version: detachedVersion,
                implied: true,
                optional: false});
        }
    }
    for (const dependency of plugin.dependencies) {
        if (!updateData.plugins[dependency.name]) {
            dependency.title = dependency.name; // optional dependency suspended
        } else {
            dependency.title = updateData.plugins[dependency.name].title;
        }
    }
    return plugin.dependencies;
};

const versionToNumber = (version) => {
    const [major, minor] = version.split('.').map(n => parseInt(n));
    return major * 1E5 + minor;
};

const checkActive = (warning, plugin) => {
    warning.active = !!warning.versions.find(version => plugin.version.match(`^(${version.pattern})$`));
    return warning;
};

const fixGitHubUrl = (url, defaultBranch) => {
    const match = url && url.match(/^(https?:\/\/github.com\/[^/]+\/[^/]+)\/(.+)$/);
    if (match && defaultBranch && !match[2].startsWith('tree/')) {
        return `${match[1]}/tree/${defaultBranch}/${match[2]}`;
    }
    return url;
};

const fetchBomDependencies = async (reporter) => {
    try {
        const bomUrl = 'https://raw.githubusercontent.com/jenkinsci/bom/master/bom-latest/pom.xml';
        const bom = await requestGET({url: bomUrl, reporter});
        const xml = await parseStringPromise(bom);
        return xml.project.dependencyManagement[0].dependencies[0].dependency.map(dep => dep.artifactId);
    } catch(ex) {
        console.warn('Failed to fetch BOM data', ex);
    }
    return [];
};

const fetchSuspendedPlugins = async ({updateData, names, createNode}) => {
    const suspendedPromises = [];
    for (const deprecation of Object.keys(updateData.deprecations)) {
        if (!names.includes(deprecation)) {
            suspendedPromises.push(createNode({
                ...updateData.deprecations[deprecation],
                id: deprecation,
                name: deprecation,
                parent: null,
                children: [],
                internal: {
                    type: 'SuspendedPlugin',
                    contentDigest: crypto.createHash('md5').update(deprecation.trim()).digest('hex')
                }
            }));
        }
    }
    await Promise.all(suspendedPromises);
};

const processCategoryData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('process categories');
    sectionActivity.start();
    for (const category of categoryList) {
        createNode({
            ...category,
            id: category.id.trim(),
            parent: null,
            children: [],
            internal: {
                type: 'JenkinsPluginCategory',
                contentDigest: crypto
                    .createHash('md5')
                    .update(`category${category.name}`)
                    .digest('hex')
            }
        });
    }
    sectionActivity.end();
};

const fetchLabelData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch labels info');
    sectionActivity.start();
    const url = 'https://raw.githubusercontent.com/jenkinsci/jenkins/master/core/src/main/resources/hudson/model/Messages.properties';
    const messages = await requestGET({url, reporter});
    const keyPrefix = 'UpdateCenter.PluginCategory';
    for (const line of messages.split('\n')) {
        const [key, value] = line.split('=', 2).map(s => s.trim());
        const labelId = key.substring(keyPrefix.length + 1);
        if (key.startsWith(keyPrefix)) {
            createNode({
                title: value,
                id: labelId,
                parent: null,
                children: [],
                internal: {
                    type: 'JenkinsPluginLabel',
                    contentDigest: crypto
                        .createHash('md5')
                        .update(`label${labelId}`)
                        .digest('hex')
                }
            });
        }
    }
    sectionActivity.end();
};

const fetchSiteInfo = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch plugin api info');
    sectionActivity.start();
    const url = 'https://plugins.jenkins.io/api/info';
    const info = await requestGET({url, reporter});

    createNode({
        api: {
            ...info
        },
        website: {
            commit: execSync('git rev-parse HEAD').toString().trim(),
            version: require('find-package-json')().next().value.version,
        },
        id: 'pluginSiteInfo',
        parent: null,
        children: [],
        internal: {
            type: 'JenkinsPluginSiteInfo',
            contentDigest: crypto.createHash('md5').update('pluginSiteInfo').digest('hex')
        }
    });
    sectionActivity.end();
};


const fetchPluginVersions = async ({createNode, reporter, firstReleases}) => {
    const sectionActivity = reporter.activityTimer('fetch plugin versions');
    sectionActivity.start();
    const url = 'https://updates.jenkins.io/plugin-versions.json';
    const json = await requestGET({url, reporter});
    for (const pluginVersions of Object.values(json.plugins)) {
        for (const data of Object.values(pluginVersions)) {
            /*
            buildDate    "May 13, 2020"
            dependencies    […]
            name    "42crunch-security-audit"
            requiredCore    "2.164.3"
            sha1    "nQl64SC4dvbFE0Kbwkdqe2C0hG8="
            sha256    "rMxlZQqnAofpD1/vNosqcPgghuhXKzRrpLuLHV8XUQ8="
            url    "https://updates.jenkins.io/download/plugins/42crunch-security-audit/2.1/42crunch-security-audit.hpi"
            version 2.1
            */
            const date = dateFNs.parse(data.buildDate, 'MMMM d, yyyy', new Date(0));
            if (!firstReleases[data.name] || firstReleases[data.name].getTime() > date.getTime()) {
                firstReleases[data.name] = date;
            }
            createNode({
                ...data,
                buildDate: date,
                id: `${data.name}_${data.version}`,
                parent: null,
                children: [],
                internal: {
                    type: 'JenkinsPluginVersion',
                    contentDigest: crypto
                        .createHash('md5')
                        .update(`pluginVersion_${data.name}_${data.version}`)
                        .digest('hex')
                }
            });
        }
    }
    sectionActivity.end();
};

module.exports = {
    fetchSiteInfo,
    fetchLabelData,
    processCategoryData,
    fetchPluginData,
    fetchPluginVersions,
    fixGitHubUrl,
    getPluginContent,
    requestGET
};
