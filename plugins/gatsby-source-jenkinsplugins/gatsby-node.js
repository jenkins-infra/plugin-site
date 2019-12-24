/* eslint-disable no-console */
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

/*
plugins: `
  firstRelease: Date
  buildDate: Date
  categories: {
    id: String!
  }
  dependencies: {
    name: String
    title: String
    optional: Boolean
    version: String
    implied: Boolean
  }
  maintainers: {
    id: String
    name: String
    email: String
  }
  excerpt: String
  gav: String
  labels: {
    id: String!
  }
  name: String
  previousTimestamp: Date
  previousVersion: String
  releaseTimestamp: Date
  requiredCore: String
  scm: {
    issues: String
    link: String
    inLatestRelease: String
    sinceLatestRelease: String
    pullRequest: String
  }
  sha1: String
  // stats:
  title: String
  url: String
  version: String
  // securityWarnings:
  wiki: {
    content: String
    url: String
  }
`
*/

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

const getPluginSiteVersion = () => {
    const file = path.join(__dirname, '../../GIT_COMMIT');
    try {
        return fs.existsSync(file) ? fs.readFileSync(file, 'utf-8').substring(0, 7) : 'TBD';
    } catch (err) {
        console.error(`Problem accessing ${file}`, err);
    }
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
            const promise = (
                process.env.SLOW_MODE
                    ? requestGET({reporter, url: `https://plugins.jenkins.io/api/plugin/${plugin.name}`})
                    : Promise.resolve(plugin)
            );
            promises.push(promise.then(pluginData => {
                pluginData.wiki = pluginData.wiki || {};
                // absolutely required fields
                pluginData.wiki.content = pluginData.wiki.content || '';
                pluginData.wiki.url = pluginData.wiki.url || '';
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
        page = pluginsContainer.page + 1;
    } while (!page || pluginsContainer.page <= pluginsContainer.pages);
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
            commit: getPluginSiteVersion()
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

exports.sourceNodes = async (
    {actions, reporter},
    { /* options */ } // eslint-disable-line no-empty-pattern
) => {
    const {createNode} = actions;

    try {
        await fetchSiteInfo({createNode, reporter});
        await fetchPluginData({createNode, reporter});
        await fetchCategoryData({createNode, reporter});
        await fetchLabelData({createNode, reporter});
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err}`
        );
    }
};
