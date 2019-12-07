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

const getPluginSiteVersion = () => {
  const file = path.join(__dirname, '../../GIT_COMMIT');
  try {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf-8').substring(0, 7) : 'TBD';
  } catch (err) {
    console.error(`Problem accessing ${file}`, err);
  }
};

exports.sourceNodes = async (
  { actions, reporter },
  { /* options */ } // eslint-disable-line no-empty-pattern
) => {
  const { createNode } = actions;

  // Do the initial fetch
  const activity = reporter.activityTimer('fetch plugin data');
  activity.start();

  try {
    let page;

    do {
      const url = 'https://plugins.jenkins.io/api/info';
      console.info(`Fetching '${url}'`);
      const info = await axios
        .get(url)
        .then((results) => {
          if (results.status !== 200) {
            throw results.data;
          }
          return results.data;
        });

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
    } while (0);

    page = 1;
    while (1) {
      const url = `https://plugins.jenkins.io/api/plugins/?limit=100&page=${page}`;
      console.info(`Fetching '${url}'`);
      const pluginsContainer = await axios
        .get(url)
        .then((results) => {
          if (results.status !== 200) {
            throw results.data;
          }
          return results.data;
        });

      for (const plugin of pluginsContainer.plugins) {
        createNode({
          ...plugin,
          id: plugin.name.trim(),
          parent: null,
          children: [],
          internal: {
            type: 'JenkinsPlugin',
            contentDigest: crypto.createHash('md5').update(`plugin${plugin.name.trim()}`).digest('hex')
          }
        });
      }
      page = pluginsContainer.page + 1;
      if (pluginsContainer.page > pluginsContainer.pages) {
        break;
      }
    }

    page = 1;
    while (1) {
      const url = `https://plugins.jenkins.io/api/categories/?limit=100&page=${page}`;
      console.info(`Fetching '${url}'`);
      const categoriesContainer = await axios
        .get(url)
        .then((results) => {
          if (results.status !== 200) {
            throw results.data;
          }
          return results.data;
        });

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
      page = categoriesContainer.page + 1;
      if (!page || categoriesContainer.page > categoriesContainer.pages) {
        break;
      }
    }

    page = 1;
    while (1) {
      const url = `https://plugins.jenkins.io/api/labels/?limit=100&page=${page}`;
      console.info(`Fetching '${url}'`);
      const labelsContainer = await axios
        .get(url)
        .then((results) => {
          if (results.status !== 200) {
            throw results.data;
          }
          return results.data;
        });

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
      page = labelsContainer.page + 1;
      if (!page || labelsContainer.page > labelsContainer.pages) {
        break;
      }
    }
  } catch (err) {
    reporter.panic(
      `gatsby-source-goodreads: Failed to parse API call -  ${err}`
    );
  }
  activity.end();
};
