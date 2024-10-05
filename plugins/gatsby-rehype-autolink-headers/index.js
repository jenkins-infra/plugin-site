const toString = require('hast-util-to-string');
const visit = require('unist-util-visit');
const slugs = require('github-slugger')();
const deburr = require('lodash/deburr');
const merge = require('lodash/merge');
const Rehype = require('rehype');
const styleToObject = require('style-to-object');

const svgIcon = '<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';

const pluginDefaults = {
    icon: svgIcon,
    className: 'anchor',
    maintainCase: false,
    removeAccents: false,
    enableCustomId: false,
    isIconAfterHeader: false,
    elements: null,
};

const rehype = new Rehype().data('settings', {
    fragment: true,
    space: 'html',
    emitParseErrors: false,
    verbose: false
}); //Load language extension if defined

module.exports = ({htmlAst}, pluginOptions) => {
    const {
        icon,
        className,
        maintainCase,
        removeAccents,
        enableCustomId,
        prependId,
        isIconAfterHeader,
        elements,
    } = merge({}, pluginDefaults, pluginOptions);
    slugs.reset();

    const visitNode = node => {
        // If elements array exists, do not create links for heading types not included in array
        if (Array.isArray(elements) && !elements.includes(node.tagName)) {
            return;
        }

        let id;
        if (enableCustomId && node.children.length > 0) {
            const last = node.children[node.children.length - 1];
            // This regex matches to preceding spaces and {#custom-id} at the end of a string.
            // Also, checks the text of node won't be empty after the removal of {#custom-id}.
            const match = /^(.*?)\s*\{#([\w-]+)\}$/.exec(toString(last));
            if (match && (match[1] || node.children.length > 1)) {
                id = match[2];
                // Remove the custom ID from the original text.
                if (match[1]) {
                    last.value = match[1];
                } else {
                    node.children.pop();
                }
            }
        }
        if (!id) {
            const slug = slugs.slug(toString(node).trim(), maintainCase);
            id = removeAccents ? deburr(slug)() : slug;
        }
        const label = id.split('-').join(' ').trim();
        if (prependId) {
            id = `${prependId}${id}`;
        }
        node.properties = {...node.properties || {}, id: id};

        if (icon !== false) {
            const method = isIconAfterHeader ? 'push' : 'unshift';
            const styles = styleToObject(node.properties.style || '') || {};
            styles.position = 'relative';
            node.properties.style = Object.entries(styles).map(i => `${i[0]}: ${i[1]}`).join('; ');
            node.children[method](rehype.parse(`<a href="#${id}" aria-label="${label} permalink" class="${className} ${isIconAfterHeader ? 'after' : 'before'}">${icon}</a>`));
        }
    };
    visit(htmlAst, node => node?.tagName?.match(/^h\d+$/), visitNode);

    return htmlAst;
};
