/* eslint-disable no-console */
const visit = require('unist-util-visit');
const isRelativeUrl = require('is-relative-url');

module.exports = (data) => {
    const {markdownNode, markdownAST, getNode} = data;
    const parent = getNode(markdownNode.parent);
    if (parent.baseHref && parent.baseHref.startsWith('http')) {
        // find any relative links in our markdown and convert them to full links
        visit(markdownAST, 'image', node => {
            if (isRelativeUrl(node.url)) {
                node.url = new URL(node.url, `${parent.baseHref}/`).toString();
            }
        });
    }
    return markdownAST;
};

/*
module.exports.mutateSource = (data) => {
    const {markdownNode} = data;
    console.log('fields', markdownNode.fields);
};
*/
// mutateSource is an option, but doesn't have ast, so could potentially grab urls ahead of time
