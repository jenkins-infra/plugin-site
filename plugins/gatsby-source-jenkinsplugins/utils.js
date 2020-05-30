/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const URL = require('url');
const axiosRetry = require('axios-retry');

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

const fetchPluginData = async ({createNode, reporter}) => {
    const sectionActivity = reporter.activityTimer('fetch plugins info');
    sectionActivity.start();
    const promises = [];
    let page = 1;
    let pluginsContainer;
    do {
        const url = `https://plugins.jenkins.io/api/plugins/?limit=100&page=${page}`;
        pluginsContainer = await requestGET({url, reporter});

        for (const plugin of pluginsContainer.plugins) {
            promises.push(getPluginContent({plugin, reporter}).then(pluginData => {
                return createNode({
                    ...pluginData,
                    id: pluginData.name.trim(),
                    parent: null,
                    children: [],
                    internal: {
                        type: 'JenkinsPlugin',
                        contentDigest: crypto.createHash('md5').update(`plugin${pluginData.name.trim()}`).digest('hex')
                    }
                });
            }));
        }
        await Promise.all(promises);
        page = pluginsContainer.page + 1;
    } while (!page || pluginsContainer.page < pluginsContainer.pages);
    await Promise.all(promises);
    sectionActivity.end();
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

module.exports = {
    fetchSiteInfo,
    fetchLabelData,
    fetchCategoryData,
    fetchPluginData,
    getPluginContent,
    requestGET
}
;
