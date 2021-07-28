const {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    processCategoryData,
    fetchLabelData,
    fetchStats,
} = require('./utils');

exports.sourceNodes = async (
    {actions, reporter},
    { /* options */ } // eslint-disable-line no-empty-pattern
) => {
    const {createNode} = actions;

    try {
        const firstReleases = {};
        const stats = {};
        await Promise.all([
            fetchStats({reporter, stats}),
            fetchSiteInfo({createNode, reporter}),
            processCategoryData({createNode, reporter}),
            fetchLabelData({createNode, reporter}),
            fetchPluginVersions({createNode, reporter, firstReleases}),
        ]).then(() => fetchPluginData({createNode, reporter, firstReleases, stats}));
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};
