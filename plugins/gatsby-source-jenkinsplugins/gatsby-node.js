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

exports.createSchemaCustomization = ({actions}) => {
    const {createTypes} = actions;

    createTypes(`
        type JenkinsPlugin implements Node {
            wiki: JenkinsPluginWiki @link(from: "name", by: "name")
        }
    `);
};


async function onCreateNode({node, actions, loadNodeContent, createNodeId, reporter, createContentDigest}) {
    if (!['text/pluginhtml'].includes(node.internal.mediaType)) {
        return;
    }

    const {createNode, createParentChildLink} = actions; // Load Asciidoc contents
    const html = await loadNodeContent(node); // Load Asciidoc file for extracting

    try {
        const htmlNode = {
            id: createNodeId(`${node.id} >>> PluginHTML`),
            parent: node.id,
            internal: {
                type: 'JenkinsPluginHtml'
            },
            children: [],
            html,
        };

        htmlNode.internal.contentDigest = createContentDigest(htmlNode);
        createNode(htmlNode);
        createParentChildLink({parent: node, child: htmlNode});
    } catch (err) {
        reporter.panicOnBuild(`Error processing html ${node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`}:\n ${err.message}`);
    }
}
exports.onCreateNode = onCreateNode;


