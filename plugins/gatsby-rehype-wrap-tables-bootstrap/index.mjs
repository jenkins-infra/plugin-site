import {visitParents} from 'unist-util-visit-parents';

const plugin = ({
    htmlAst,
    compiler: {parseString},
}) => {
    visitParents(htmlAst, {tagName: 'table'}, (node, ancestors) => {
        const wrapper = parseString('<div class="table-responsive"></div>').children[0];
        node.properties = {...node.properties || {}};
        const classes = new Set((node.properties.class || '').split(/\s/).filter(s => s.trim()));
        classes.add('table');
        classes.add('table-bordered');
        node.properties.class = Array.from(classes).join(' ');
        wrapper.children.push(node);
        ancestors[ancestors.length - 1].children = ancestors[ancestors.length - 1].children.map(parentNode => {
            if (parentNode === node) {
                return wrapper;
            }
            return parentNode;
        });
        return node;
    });

    return htmlAst;
};
export default plugin;
