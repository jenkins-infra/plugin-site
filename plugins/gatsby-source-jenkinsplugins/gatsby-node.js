const {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    processCategoryData,
    fetchLabelData,
} = require('./utils');

exports.sourceNodes = async (
    {actions, reporter},
    { /* options */ } // eslint-disable-line no-empty-pattern
) => {
    const {createNode} = actions;

    try {
        const firstReleases = {};
        const labelToCategory = {};
        await Promise.all([
            fetchSiteInfo({createNode, reporter}),
            processCategoryData({createNode, reporter, labelToCategory}),
            fetchLabelData({createNode, reporter}),
            fetchPluginVersions({createNode, reporter, firstReleases}),
        ]).then(() => fetchPluginData({createNode, reporter, firstReleases, labelToCategory}));
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};
