const {
    fetchSiteInfo,
    fetchPluginData,
    fetchPluginVersions,
    processCategoryData,
    fetchLabelData,
    fetchStats,
} = require('./utils');
const {createRemoteFileNode} = require('gatsby-source-filesystem');

exports.sourceNodes = async (
    {actions: {createNode, createNodeField}, reporter, createContentDigest, createNodeId},
    { /* options */ } // eslint-disable-line no-empty-pattern
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


function getNestedObject(obj, path) {
    const properties = Array.isArray(path) ? path : path.split('.');
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

exports.createSchemaCustomization = ({actions}) => {
    const {createFieldExtension, createTypes} = actions;

    createFieldExtension({
        name: 'unionFields',
        args: {
            fields: '[String!]!',
        },
        extend(options) {
            return {
                resolve(source) {
                    for (const field of options.fields) {
                        const value = getNestedObject(source, field.split('.'));
                        if (value) {
                            return value;
                        }
                    }
                    return null;
                },
            };
        },
    });
    createTypes(`
        type JenkinsPlugin implements Node {
            wiki: JenkinsPluginWiki @link(from: "name", by: "name")
        }
        type JenkinsPluginWiki implements Node {
            html: String @unionFields(fields: ["childMarkdownRemark.html","internal.content"])
        }
    `);
};
