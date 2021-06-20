/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const URL = require('url');
const axiosRetry = require('axios-retry');
const dateFNs = require('date-fns');
const {parseStringPromise} = require('xml2js');

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
    do {
        const url = `https://plugins.jenkins.io/api/plugins/?limit=100&page=${page}`;
        pluginsContainer = await requestGET({url, reporter});
        for (const plugin of pluginsContainer.plugins) {
            const pluginName = plugin.name.trim();
            names.push(pluginName);
            const pluginUC = updateData.plugins[pluginName];
            pluginUC.maintainers = pluginUC.developers;
            pluginUC.maintainers.forEach(maint => {maint.id = maint.developerId, delete(maint.developerId);});
            delete(pluginUC.developers);
            promises.push(getPluginContent({plugin, reporter}).then(pluginData => {
                const p = createNode({
                    ...pluginUC,
                    stats: pluginData.stats,
                    wiki: pluginData.wiki,
                    securityWarnings: updateData.warnings.filter(p => p.name == pluginName)
                        .map(w => checkActive(w, pluginUC)),
                    dependencies: pluginData.dependencies,
                    categories: pluginData.categories,
                    firstRelease: firstReleases[pluginName].toISOString(),
                    id: pluginName,
                    hasPipelineSteps: pipelinePluginIds.includes(pluginName),
                    hasBomEntry: !!bomDependencies.find(artifactId => pluginData.gav.includes(`:${artifactId}:`)),
                    parent: null,
                    children: [],
                    internal: {
                        type: 'JenkinsPlugin',
                        contentDigest: crypto.createHash('md5').update(`plugin${pluginData.name.trim()}`).digest('hex')
                    }
                });
                if (!p || !p.then) {
                    if (process.env.GATSBY_SENTRY_DSN) {
                        const Sentry = require('@sentry/node');
                        Sentry.init({
                            dsn: process.env.GATSBY_SENTRY_DSN
                        });
                        Sentry.captureMessage(new Error(`Error creatingNode for plugin: ${pluginData.name.trim()}`), {extra: {pluginData: pluginData, p: p}});
                    }
                    console.log('p', p, plugin);
                    return new Error('no promise returned');
                }
                p.then(() => {
                    return Promise.all(pluginData.maintainers.map(maintainer => {
                        return createNode({
                            ...maintainer,
                            internal: {
                                type: 'JenkinsMaintainer',
                                contentDigest: crypto.createHash('md5').update(maintainer.id).digest('hex')
                            }
                        });
                    }));
                });
                return p.then(() => {
                    return Promise.all(pluginData.dependencies.map(dependency => {
                        const mergedId = `${pluginData.name.trim()}:${dependency.name.trim()}`;
                        return createNode({
                            ...dependency,
                            dependentTitle: pluginData.title,
                            dependentName: pluginData.name,
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

const checkActive = (warning, plugin) => {
    warning.active = !!warning.versions.find(version => plugin.version.match(`^${version.pattern}$`));
    return warning;
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

const fetchCategoryData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch categories info');
    sectionActivity.start();
    const url = 'https://plugins.jenkins.io/api/categories/?limit=100';
    const categoriesContainer = await requestGET({url, reporter});

    for (const category of categoriesContainer.categories) {
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
    const url = 'https://plugins.jenkins.io/api/labels/?limit=100';
    const labelsContainer = await requestGET({url, reporter});

    for (const label of labelsContainer.labels) {
        createNode({
            ...label,
            id: label.id.trim(),
            parent: null,
            children: [],
            internal: {
                type: 'JenkinsPluginLabel',
                contentDigest: crypto
                    .createHash('md5')
                    .update(`label${label.name}`)
                    .digest('hex')
            }
        });
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
            buildDate	"May 13, 2020"
            dependencies	[…]
            name	"42crunch-security-audit"
            requiredCore	"2.164.3"
            sha1	"nQl64SC4dvbFE0Kbwkdqe2C0hG8="
            sha256	"rMxlZQqnAofpD1/vNosqcPgghuhXKzRrpLuLHV8XUQ8="
            url	"https://updates.jenkins.io/download/plugins/42crunch-security-audit/2.1/42crunch-security-audit.hpi"
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
    fetchCategoryData,
    fetchPluginData,
    fetchPluginVersions,
    getPluginContent,
    requestGET
};
