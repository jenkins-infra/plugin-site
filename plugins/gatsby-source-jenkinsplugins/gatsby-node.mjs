import {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    fetchPluginHealthScore,
    processCategoryData,
    fetchLabelData,
    fetchStats,
} from './utils.mjs';
import {createRemoteFileNode} from 'gatsby-source-filesystem';

export const sourceNodes = async (
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
            fetchPluginHealthScore({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter}),
        ]).then(() => fetchPluginData({createNode, createNodeField, createContentDigest, createNodeId, createRemoteFileNode, reporter, firstReleases, stats}));
    } catch (err) {
        reporter.panic(
            `gatsby-source-jenkinsplugin: Failed to parse API call -  ${err.stack || err}`
        );
    }
};

export const createSchemaCustomization = ({actions}) => {
    const {createTypes} = actions;

    createTypes(`
        type JenkinsPlugin implements Node {
            wiki: JenkinsPluginWiki @link(from: "name", by: "name")
            releases: [JenkinsPluginVersion] @link(from: "name", by: "name")
            healthScore: JenkinsPluginHealthScore @link(from: "name", by: "id")
            buildDate: Date @dateformat
            previousTimestamp: Date @dateformat
            releaseTimestamp: Date @dateformat
        }

        type JenkinsPluginVersion implements Node {
            releaseTimestamp: Date @dateformat
            plugin: JenkinsPlugin @link(from: "name", by: "name")
            machineVersion: Int
        }

        type JenkinsPluginHealthScoreDetailsComponentsResolutions {
            text: String
            link: String
        }

        type JenkinsPluginHealthScoreDetailsComponents {
            value: Int
            weight: Int
            reasons: [String]
            resolutions: [JenkinsPluginHealthScoreDetailsComponentsResolutions]
        }

        type JenkinsPluginHealthScoreDetails {
            value: Int
            weight: Float
            components: [JenkinsPluginHealthScoreDetailsComponents]
            name: String
        }

        type JenkinsPluginHealthScore implements Node {
            url: String
            name: String
            date: Date @dateformat
            details: [JenkinsPluginHealthScoreDetails]
            value: Int
        }

        type JenkinsPluginHealthScoreStatistics implements Node {
            average: Int
            minimum: Int
            maximum: Int
            firstQuartile: Int
            median: Int
            thirdQuartile: Int
            name: String
        }
    `);
};
