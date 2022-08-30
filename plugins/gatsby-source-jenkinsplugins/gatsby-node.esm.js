import {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    processCategoryData,
    fetchLabelData,
    fetchStats,
} from './utils';
import {createRemoteFileNode} from 'gatsby-source-filesystem';

exports.sourceNodes = async (
    {actions: {createNode, createNodeField}, reporter, createContentDigest, createNodeId},
    { /* options */} // eslint-disable-line no-empty-pattern
) => {
    try {
        const firstReleases = {};
        const stats = {};
        await Promise.all([
            fetchStats({reporter, stats}),
            fetchSiteInfo({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter}),
            processCategoryData({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter}),
            fetchLabelData({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter}),
            fetchPluginVersions({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter, firstReleases}),
        ]).then(() => fetchPluginData({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter, firstReleases, stats}));
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};

exports.createSchemaCustomization = ({actions}) => {
    const {createTypes} = actions;

    createTypes(`
        type JenkinsPlugin implements Node {
            wiki: JenkinsPluginWiki @link(from: "name", by: "name")
            buildDate: Date
            previousTimestamp: Date
            releaseTimestamp: Date
        }

        type JenkinsPluginVersion implements Node {
            releaseTimestamp: Date
        }
    `);
};

