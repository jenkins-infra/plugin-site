const {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    processCategoryData,
    fetchLabelData,
    fetchStats,
} = require('./utils');

exports.sourceNodes = async (
    {actions: {createNode}, reporter, createContentDigest, createNodeId},
    { /* options */ } // eslint-disable-line no-empty-pattern
) => {
    try {
        const firstReleases = {};
        const stats = {};
        await Promise.all([
            fetchStats({reporter, stats}),
            fetchSiteInfo({createNode, createContentDigest, createNodeId, reporter}),
            processCategoryData({createNode, createContentDigest, createNodeId, reporter}),
            fetchLabelData({createNode, createContentDigest, createNodeId, reporter}),
            fetchPluginVersions({createNode, createContentDigest, createNodeId, reporter, firstReleases}),
        ]).then(() => fetchPluginData({createNode, createContentDigest, createNodeId, reporter, firstReleases, stats}));
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};
