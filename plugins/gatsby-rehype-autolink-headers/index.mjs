import {toString} from 'hast-util-to-string';
import visit from 'unist-util-visit';
import slugger from 'github-slugger';
import _ from 'lodash';
import {rehype} from 'rehype';
import styleToObject from 'style-to-object';

const slugs = new slugger();

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

const rehypeParser = new rehype().data('settings', {
    fragment: true,
    space: 'html',
    emitParseErrors: false,
    verbose: false
}); //Load language extension if defined

export default ({htmlAst}, pluginOptions) => {
    const {
        icon,
        className,
        maintainCase,
        removeAccents,
        enableCustomId,
        prependId,
        isIconAfterHeader,
        elements,
    } = Object.assign({}, pluginDefaults, pluginOptions);
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
            id = removeAccents ? _.deburr(slug)() : slug;
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
            node.children[method](rehypeParser.parse(`<a href="#${id}" aria-label="${label} permalink" class="${className} ${isIconAfterHeader ? 'after' : 'before'}">${icon}</a>`));
        }
    };
    visit(htmlAst, node => node?.tagName?.match(/^h\d+$/), visitNode);

    return htmlAst;
};
