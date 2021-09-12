/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const {execSync} = require('child_process');
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

const shouldFetchPluginContent = (id) => {
    if (process.env.GET_CONTENT_SINGLE && process.env.GET_CONTENT_SINGLE === id) {
        return true;
    }
    if (!process.env.GET_CONTENT) {
        return false;
    }
    return true;
};


const getPluginContent = async ({wiki, pluginName, reporter}) => {
    if (!shouldFetchPluginContent(pluginName)) {
        wiki.content = '';
        return wiki;
    }
    return requestGET({reporter, url: `https://plugins.jenkins.io/api/plugin/${pluginName}`}).then(data => {
        wiki.content = data.wiki.content || '';
        wiki.url = data.wiki.url || '';
        return wiki;
    });
};

const fetchPluginData = async ({createNode, reporter, firstReleases, stats}) => {
    const sectionActivity = reporter.activityTimer('fetch plugins info');
    sectionActivity.start();
    const promises = [];
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
        const deprecatedPlugin = updateData.plugins[deprecation];
        if (deprecatedPlugin) {
            deprecatedPlugin.labels.push('deprecated');
            deprecatedPlugin.deprecationNotice = updateData.deprecations[deprecation].url;
        }
    }
    const documentationListUrl = 'https://updates.jenkins.io/current/plugin-documentation-urls.json';
    const documentation = await requestGET({url: documentationListUrl, reporter});
    for (const plugin of Object.values(updateData.plugins)) {
        const pluginName = plugin.name.trim();
        names.push(pluginName);
        const developers = plugin.developers || [];
        developers.forEach(maint => {maint.id = maint.developerId, delete(maint.developerId);});
        plugin.scm = fixGitHubUrl(plugin.scm, plugin.defaultBranch || 'master');
        const pluginStats = stats[pluginName] || {installations: null};
        pluginStats.trend = computeTrend(plugin, stats, updateData.plugins);
        const allDependencies = getImpliedDependenciesAndTitles(plugin, detachedPlugins, updateData);
        promises.push(getPluginContent({wiki: documentation[pluginName] || {}, pluginName, reporter}).then(wiki => {
            const p = createNode({
                ...plugin,
                stats: pluginStats,
                wiki: wiki,
                securityWarnings: updateData.warnings.filter(p => p.name == pluginName)
                    .map(w => checkActive(w, plugin)),
                dependencies: allDependencies,
                firstRelease: firstReleases[pluginName] && firstReleases[pluginName].toISOString(),
                id: pluginName,
                hasPipelineSteps: pipelinePluginIds.includes(pluginName),
                hasBomEntry: !!bomDependencies.find(artifactId => plugin.gav.includes(`:${artifactId}:`)),
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
                    Sentry.captureMessage(new Error(`Error creatingNode for plugin: ${pluginName}`), {extra: {pluginData: plugin, p: p}});
                }
                return new Error('no promise returned');
            }
            p.then(() => {
                return Promise.all(developers.map(maintainer => {
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
                return Promise.all(allDependencies.map(dependency => {
                    const mergedId = `${pluginName}:${dependency.name.trim()}`;
                    return createNode({
                        ...dependency,
                        dependentTitle: plugin.title,
                        dependentName: plugin.name,
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
    plugin.dependencies = plugin.dependencies || [];
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

const computeTrend = (plugin, stats, plugins) => {
    if (!stats[plugin.name]) {
        return 0;
    }
    const increase = getPercentage(plugin.name, stats, 1) - getPercentage(plugin.name, stats, 2);
    const maxDependent = Object.values(plugins)
        .filter(p => isMandatoryDependency(p, plugin))
        .map(p => [p.name, getPercentage(p.name, stats, 1)])
        .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[1];
    const independence = 1 - maxDependent / getPercentage(plugin.name, stats, 1);
    return Math.round(1E6 * increase * Math.max(0, independence)) || 0;
};

const isMandatoryDependency = (p, plugin) => p.dependencies && !!p.dependencies
    .filter(d => !d.optional && d.name == plugin.name).length;

const getPercentage = (name, stats, monthsAgo) => {
    if (!stats[name]) {
        return 0;
    }
    const installations = stats[name].installations;
    const coreInstallations = stats.core.installations;
    if (!installations[installations.length - monthsAgo]) {
        return 0;
    }
    return installations[installations.length - monthsAgo].total
            / coreInstallations[coreInstallations.length - monthsAgo].total;
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

const fetchStats = async ({reporter, stats}) => {
    const timeSpan = 12;
    const totalUrl = 'https://stats.jenkins.io/jenkins-stats/svg/total-jenkins.csv';
    const totalInstalls = (await requestGET({url: totalUrl, reporter})).trim().split('\n');
    stats.core = {installations: []};
    const timestamps = [];
    for (let monthsAgo = 1; monthsAgo <= timeSpan; monthsAgo++) {
        const [month, coreInstalls] = csvParse(totalInstalls[totalInstalls.length - monthsAgo]);
        const pluginInstallsUrl = `https://stats.jenkins.io/jenkins-stats/svg/${month}-plugins.csv`;
        const timestamp = Date.parse(`${month}`.replace(/(..)$/, '-$1'));
        timestamps.push(timestamp);
        const pluginInstalls = (await requestGET({url: pluginInstallsUrl, reporter})).split('\n');
        stats.core.installations[timeSpan - monthsAgo] = {timestamp: timestamp, total: coreInstalls};
        for (const pluginRow of pluginInstalls) {
            const [pluginName, installs] = csvParse(pluginRow);
            stats[pluginName] = stats[pluginName] || {installations: []};
            stats[pluginName].installations[timeSpan - monthsAgo] = {timestamp: timestamp, total: installs};
        }
    }
    for (const pluginName of Object.keys(stats)) {
        for (let idx = 0; idx < timeSpan; idx++) {
            stats[pluginName].installations[idx] = stats[pluginName].installations[idx]
                || {total: 0, timestamp: timestamps[idx]};
        }
        stats[pluginName].currentInstalls = stats[pluginName].installations[timeSpan - 1].total || 0;
    }
};

const csvParse = (row) => {
    return row.split(',').map(s => s ? JSON.parse(s) : s).map(s => isNaN(parseInt(s)) ? s : parseInt(s));
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
    fetchStats,
    getPluginContent,
    requestGET
};
