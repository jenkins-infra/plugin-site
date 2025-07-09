import axios from 'axios';
import path from 'path';
import crypto from 'crypto';
import {load} from 'cheerio';
import {execSync} from 'child_process';
import axiosRetry, {exponentialDelay} from 'axios-retry';
import {parse as parseDate, parseJSON} from 'date-fns';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import PQueue from 'p-queue';
import {parseStringPromise} from 'xml2js';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const CATEGORY_LIST = require('./categories.json');

import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import findPackageJson from 'find-package-json';

const API_URL = process.env.JENKINS_IO_API_URL || 'https://plugins.jenkins.io/api';

axiosRetry(axios, {retries: 5, retryDelay: exponentialDelay});

const requestGET = async ({url, reporter}) => {
    const activity = reporter.activityTimer(`Fetching '${url}'`);
    activity.start();

    try {
        const results = await axios.get(url);
        if (results.status !== 200) {
            throw results.data;
        }
        return results.data;
    } catch (err) {
        if (err && err.response && err.response.status == 404) {
            reporter.error(`${url} does not return any data`);
            return null;
        }
        reporter.panic(`error trying to fetch ${url}`, err);
        throw err;
    } finally {
        activity.end();
    }
};

const singleContents = process.env.GET_CONTENT_SINGLE?.split(',')?.map(s => s.trim());
const shouldFetchPluginContent = (id) => {
    if (singleContents && singleContents.includes(id)) {
        return true;
    }
    if (!process.env.GET_CONTENT) {
        return false;
    }
    return true;
};


const LEGACY_WIKI_URL_RE = /^https?:\/\/wiki.jenkins(-ci.org|.io)\/display\/(jenkins|hudson)\/([^/]*)\/?$/i;
const MARKDOWN_BLOB_RE = /https?:\/\/github.com\/(jenkinsci|jenkins-infra)\/([^/.]+)\/blob\/([^/]+)\/(.+\.(md))$/;
const getPluginContent = async ({wiki, pluginName, reporter, createNode, createContentDigest}) => {
    const createWikiNode = async (mediaType, url, content) => {
        if (mediaType === 'text/markdown') {
            try {
                content = await markdownToHtml(content);
            } catch (err) {
                reporter.error(`error converting ${pluginName}`, err);
                throw err;
            }
            mediaType = 'text/pluginhtml';
        }
        return createNode({
            id: `${pluginName} <<< JenkinsPluginWiki`,
            name: pluginName,
            url: url,
            baseHref: `${path.dirname(url)}/`,
            internal: {
                type: 'JenkinsPluginWiki',
                content: content,
                contentDigest: createContentDigest(content),
                mediaType: mediaType,
            }
        });
    };
    if (!wiki.url) {
        reporter.error(`missing wiki for ${pluginName}`);
        return null;
    }
    if (!shouldFetchPluginContent(pluginName)) {
        return createWikiNode('text/pluginhtml', wiki.url, '');
    }
    try {
        if (LEGACY_WIKI_URL_RE.exec(wiki.url)) {
            const url = `https://raw.githubusercontent.com/jenkins-infra/plugins-wiki-docs/master/${pluginName}/README.md`;
            const body = await requestGET({reporter, url: url});
            if (body) {
                return createWikiNode('text/markdown', url, body);
            }
        }
        if (MARKDOWN_BLOB_RE.exec(wiki.url)) {
            const matches = wiki.url.match(MARKDOWN_BLOB_RE);
            const url = `https://raw.githubusercontent.com/${matches[1]}/${matches[2]}/${matches[3]}/${matches[4]}`;
            const body = await requestGET({reporter, url: url});
            if (body) {
                return createWikiNode('text/markdown', url, body);
            }
        }
        const data = await requestGET({reporter, url: `${API_URL}/plugin/${pluginName}`});

        const $ = load(data.wiki.content);
        $('a[href^="#"].anchor').remove();
        data.wiki.content = $.html();

        return createWikiNode('text/pluginhtml', wiki.url, data.wiki.content);
    } catch (err) {
        reporter.error(`error fetching ${pluginName}`, err);
        return createWikiNode('text/pluginhtml', wiki.url, 'MISSING');
    }
};

export const markdownToHtml = async (content) => {
    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(content);
    return String(file);
};

const processPlugin = ({createNode, names, stats, updateData, detachedPlugins, canonicalLabels, documentation, bomDependencies, pipelinePluginIds, pluginExtensionList, firstReleases, createContentDigest, createNodeId, createNodeField, createRemoteFileNode, reporter, plugin}) => {
    return async function () {
        const pluginName = plugin.name.trim();
        names.push(pluginName);
        const developers = plugin.developers || [];
        const labels = plugin.labels || [];
        developers.forEach(convertDeveloper);
        plugin.scm = fixGitHubUrl(plugin.scm, plugin.defaultBranch || 'master');
        const pluginStats = stats[pluginName] || {installations: null};
        pluginStats.trend = computeTrend(plugin, stats, updateData.plugins);
        const allDependencies = getImpliedDependenciesAndTitles(plugin, detachedPlugins, updateData);
        await getPluginContent({wiki: documentation[pluginName] || {url: ''}, pluginName, reporter, createNode, createNodeId, createNodeField, createRemoteFileNode, createContentDigest});
        delete plugin.wiki;
        const pluginNode = {
            ...plugin,
            id: createNodeId(`${plugin.name.trim()} <<< JenkinsPlugin`),
            labels: Array.from(new Set(labels.map(lbl => canonicalLabels[lbl] || lbl))),
            stats: pluginStats,
            securityWarnings: updateData.warnings.filter(p => p.name == pluginName)
                .map(w => checkActive(w, plugin)),
            dependencies: allDependencies,
            firstRelease: firstReleases[pluginName] && firstReleases[pluginName].toISOString(),
            hasPipelineSteps: pipelinePluginIds.includes(pluginName),
            hasExtensions: pluginExtensionList.includes(pluginName),
            hasBomEntry: !!bomDependencies.find(artifactId => plugin.gav.includes(`:${artifactId}:`)),
            parent: null,
            children: [],
            buildDate: plugin.buildDate ? parseDate(plugin.buildDate, 'MMMM d, yyyy', new Date(0)) : null,
            internal: {
                type: 'JenkinsPlugin',
            }
        };
        pluginNode.internal.contentDigest = createContentDigest(pluginNode);
        createNode(pluginNode);

        for (const maintainer of developers) {
            const developerNode = {
                ...maintainer,
                id: createNodeId(`${maintainer.id} <<< JenkinsDeveloper`),
                internal: {
                    type: 'JenkinsDeveloper',
                    contentDigest: crypto.createHash('md5').update(maintainer.id).digest('hex')
                }
            };
            developerNode.internal.contentDigest = createContentDigest(developerNode);
            createNode(developerNode);
        }
        for (const dependency of allDependencies) {
            const dependencyNode = {
                ...dependency,
                dependentTitle: plugin.title,
                dependentName: plugin.name,
                id: createNodeId(`${pluginName}:${dependency.name.trim()} <<< JenkinsPluginDependency`),
                internal: {
                    type: 'JenkinsPluginDependency',
                }
            };
            dependencyNode.internal.contentDigest = createContentDigest(dependencyNode);
            createNode(dependencyNode);
        }
    };
};

export const fetchPluginData = async ({createNode, createContentDigest, createNodeId, createNodeField, createRemoteFileNode, reporter, firstReleases, stats}) => {
    const sectionActivity = reporter.activityTimer('fetch plugins info');
    sectionActivity.start();
    const names = [];
    const pipelinePluginsUrl = 'https://www.jenkins.io/doc/pipeline/steps/contents.json';
    const pipelinePluginIds = await requestGET({url: pipelinePluginsUrl, reporter});
    const bomDependencies = await fetchBomDependencies(reporter);
    const updateUrl = 'https://updates.jenkins.io/update-center.actual.json';
    const updateData = await requestGET({url: updateUrl, reporter});
    const detachedPlugins = await getCoreResourceAsTuples('jenkins/split-plugins.txt', ' ', reporter);
    for (const deprecation of Object.keys(updateData.deprecations)) {
        const deprecatedPlugin = updateData.plugins[deprecation];
        if (deprecatedPlugin) {
            deprecatedPlugin.labels.push('deprecated');
            deprecatedPlugin.deprecationNotice = updateData.deprecations[deprecation].url;
        }
    }
    const documentationListUrl = 'https://updates.jenkins.io/current/plugin-documentation-urls.json';
    const documentation = await requestGET({url: documentationListUrl, reporter});

    const pluginExtensionsUrl = 'https://www.jenkins.io/doc/developer/extensions/contents.json';
    const pluginExtensionList = await requestGET({url: pluginExtensionsUrl, reporter});

    const canonicalLabelPairs = await getCoreResourceAsTuples('jenkins/canonical-labels.txt', ' ', reporter);
    const canonicalLabels = {};
    for (const [key, value] of canonicalLabelPairs) {
        canonicalLabels[key] = value;
    }

    const queue = new PQueue({concurrency: 100, autoStart: true});
    Object.values(updateData.plugins).forEach(plugin => queue.add(processPlugin({
        plugin,
        names,
        stats,
        updateData,
        detachedPlugins,
        canonicalLabels,
        documentation,
        bomDependencies,
        pipelinePluginIds,
        pluginExtensionList,
        firstReleases,
        createNode,
        createContentDigest,
        createNodeId,
        createNodeField,
        createRemoteFileNode,
        reporter
    })));
    await queue.onIdle();

    await fetchSuspendedPlugins({updateData, names, createNode});
    sectionActivity.end();
};

const getImpliedDependenciesAndTitles = (plugin, detachedPlugins, updateData) => {
    for (const detached of detachedPlugins) {
        const [detachedPlugin, detachedCore, detachedVersion] = detached;
        if (versionToNumber(detachedCore) > versionToNumber(plugin.requiredCore)) {
            plugin.dependencies.push({
                name: detachedPlugin,
                version: detachedVersion,
                implied: true,
                optional: false
            });
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

export const fixGitHubUrl = (url, defaultBranch) => {
    const match = url && url.match(/^(https?:\/\/github.com\/[^/]+\/[^/]+)\/(.+)$/);
    if (match && defaultBranch && !match[2].startsWith('tree/')) {
        return `${match[1]}/tree/${defaultBranch}/${match[2]}`;
    }
    return url;
};

const convertDeveloper = (maint) => {
    maint.id = maint.developerId;
    // graceful degradation: if names are lost, use ID
    maint.name = maint.name || maint.id.replace('_', ' ');
    delete (maint.developerId);
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
        const bomUrl = 'https://raw.githubusercontent.com/jenkinsci/bom/master/bom-weekly/pom.xml';
        const bom = await requestGET({url: bomUrl, reporter});
        const xml = await parseStringPromise(bom);
        return xml.project.dependencyManagement[0].dependencies[0].dependency.map(dep => dep.artifactId);
    } catch (ex) {
        reporter.error('Failed to fetch BOM data', ex);
    }
    return [];
};

export const fetchSuspendedPlugins = async ({updateData, names, createNode}) => {
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

export const processCategoryData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('process categories');
    sectionActivity.start();
    for (const category of CATEGORY_LIST) {
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

const getCoreResourceAsTuples = async (resourcePath, delimiter, reporter) => {
    const url = `https://raw.githubusercontent.com/jenkinsci/jenkins/master/core/src/main/resources/${resourcePath}`;
    const content = await requestGET({url, reporter});
    const parseLine = line => line.split(delimiter).map(word => word.trim());
    return content.split('\n').filter(row => row.trim().length && !row.startsWith('#')).map(parseLine);
};

export const fetchLabelData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch labels info');
    sectionActivity.start();
    const messages = await getCoreResourceAsTuples('hudson/model/Messages.properties', '=', reporter);
    const keyPrefix = 'UpdateCenter.PluginCategory';
    for (const [key, value] of messages) {
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

export const fetchSiteInfo = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch plugin api info');
    sectionActivity.start();

    createNode({
        website: {
            commit: execSync('git rev-parse HEAD').toString().trim(),
            version: findPackageJson().next().value.version,
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

export const fetchStats = async ({reporter, stats}) => {
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
            stats[pluginName].installations[timeSpan - monthsAgo] = {
                timestamp: timestamp,
                total: installs,
                percentage: installs * 100 / coreInstalls
            };
        }
    }
    for (const pluginName of Object.keys(stats)) {
        for (let idx = 0; idx < timeSpan; idx++) {
            stats[pluginName].installations[idx] = stats[pluginName].installations[idx]
                || {total: 0, timestamp: timestamps[idx], percentage: 0};
        }
        stats[pluginName].currentInstalls = stats[pluginName].installations[timeSpan - 1].total || 0;
        stats[pluginName].currentInstallPercentage = stats[pluginName].installations[timeSpan - 1].percentage || 0;
    }
};

const csvParse = (row) => {
    return row.split(',').map(s => s ? JSON.parse(s) : s).map(s => isNaN(parseInt(s)) ? s : parseInt(s));
};

export const sortVersions = (allVersions) => {
    const isInt = num => num == parseInt(num);
    return Object.entries(allVersions)
        .sort(([idx1, ver1], [idx2, ver2]) =>
            isInt(ver1) || isInt(ver2) ? parseFloat(ver1) - parseFloat(ver2) : idx1 - idx2)
        .map(e => e[1]);
};

export const fetchPluginVersions = async ({createNode, reporter, firstReleases}) => {
    const sectionActivity = reporter.activityTimer('fetch plugin versions');
    sectionActivity.start();
    const url = 'https://updates.jenkins.io/plugin-versions.json';
    const json = await requestGET({url, reporter});
    for (const pluginVersions of Object.values(json.plugins)) {
        const sortedVersions = sortVersions(Object.keys(pluginVersions));

        for (const data of Object.values(pluginVersions)) {
            /*
            releaseTimestamp    "2012-10-10T17:27:42.00Z"
            dependencies    […]
            name    "42crunch-security-audit"
            requiredCore    "2.164.3"
            sha1    "nQl64SC4dvbFE0Kbwkdqe2C0hG8="
            sha256    "rMxlZQqnAofpD1/vNosqcPgghuhXKzRrpLuLHV8XUQ8="
            url    "https://updates.jenkins.io/download/plugins/42crunch-security-audit/2.1/42crunch-security-audit.hpi"
            version 2.1
            */
            const date = new Date(data.releaseTimestamp);
            if (!firstReleases[data.name] || firstReleases[data.name].getTime() > date.getTime()) {
                firstReleases[data.name] = date;
            }
            delete (data.buildDate);
            createNode({
                ...data,
                machineVersion: sortedVersions.indexOf(data.version),
                releaseTimestamp: date,
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

export const fetchPluginHealthScore = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch plugin health score');
    sectionActivity.start();
    const baseURL = 'https://reports.jenkins.io/plugin-health-scoring';
    const {plugins, statistics} = await requestGET({url: `${baseURL}/scores.json`, reporter});
    for (const pluginName of Object.keys(plugins || {})) {
        const {value, date, details} = plugins[pluginName];
        const detailsArray = [];
        for (const categoryName of Object.keys(details)) {
            detailsArray.push(
                {
                    ...details[categoryName],
                    name: categoryName
                },
            );
        }

        createNode({
            value,
            date: parseJSON(date),
            details: detailsArray,
            id: pluginName,
            parent: null,
            children: [],
            internal: {
                type: 'JenkinsPluginHealthScore',
                contentDigest: crypto
                    .createHash('md5')
                    .update(`pluginHealthScore_${pluginName}`)
                    .digest('hex')
            }
        });
    }

    createNode({
        ...statistics,
        id: 'pluginHealthStatistics',
        name: 'pluginHealthStatistics',
        parent: null,
        children: [],
        internal: {
            type: 'JenkinsPluginHealthScoreStatistics',
            contentDigest: crypto
                .createHash('md5')
                .update('pluginHealthScoreStatistics')
                .digest('hex')
        }
    });
    sectionActivity.end();
};
