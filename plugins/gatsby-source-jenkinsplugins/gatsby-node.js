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

const {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    fetchCategoryData,
    fetchLabelData,
} = require('./utils.js');


exports.sourceNodes = async (
    {actions, reporter},
    { /* options */ } // eslint-disable-line no-empty-pattern
) => {
    const {createNode} = actions;

    try {
        await Promise.all([
            fetchSiteInfo({createNode, reporter}),
            fetchPluginData({createNode, reporter}),
            fetchCategoryData({createNode, reporter}),
            fetchLabelData({createNode, reporter}),
            fetchPluginVersions({createNode, reporter}),
        ]);
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};
