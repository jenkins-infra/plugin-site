import {rehype} from 'rehype';
import {toHtml} from 'hast-util-to-html';

import pluginFunc from '../index.mjs';

import {describe, expect, it} from '@jest/globals';

describe('handler', () => {
    const rehypeParser = new rehype().data('settings', {
        fragment: true,
        space: 'html',
        emitParseErrors: false,
        verbose: false,
    }); // Load language extension if defined

    it('should rewrite when prefix is provided', async () => {
        const options = {
            prefix: 'plugin_content_',
        };
        const htmlAst = await rehypeParser.parse('<div><a href="#place_one">Place One</a><h1 id="place_one">something</h1></div>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<div><a href="#plugin_content_place_one">Place One</a><h1 id="plugin_content_place_one">something</h1></div>');
    });
});
