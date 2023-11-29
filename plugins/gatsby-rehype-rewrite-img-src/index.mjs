import {visit} from 'unist-util-visit';

const plugin = ({
    htmlAst,
    htmlNode,
}) => {

    visit(htmlAst, {tagName: 'img'}, (node) => {
        node.properties = {...node.properties || {}};
        node.properties.src = new URL(node.properties.src, htmlNode.context.url).toString();
        return node;
    });

    return htmlAst;
};
export default plugin;
