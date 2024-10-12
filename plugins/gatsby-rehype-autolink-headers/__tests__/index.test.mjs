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

    it('bare h1s should get styles and stuff', async () => {
        const options = {};
        const htmlAst = await rehypeParser.parse('<div><h1>something</h1></div>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<div><h1 id="something" style="position: relative"><a href="#something" aria-label="something permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>something</h1></div>');
    });
    it('existing attributes should be respected', async () => {
        const options = {};
        const htmlAst = await rehypeParser.parse('<h2 dir="auto">About this plugin</h2>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<h2 dir="auto" id="about-this-plugin" style="position: relative"><a href="#about-this-plugin" aria-label="about this plugin permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>About this plugin</h2>');
    });
    it('existing styles should be respected', async () => {
        const options = {};
        const htmlAst = await rehypeParser.parse('<h2 dir="auto" style="color: red">About this plugin</h2>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<h2 dir="auto" style="color: red; position: relative" id="about-this-plugin"><a href="#about-this-plugin" aria-label="about this plugin permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>About this plugin</h2>');
    });
    it('after', async () => {
        const options = {
            isIconAfterHeader: true,
        };
        const htmlAst = await rehypeParser.parse('<h2 dir="auto" style="color: red">About this plugin</h2>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<h2 dir="auto" style="color: red; position: relative" id="about-this-plugin">About this plugin<a href="#about-this-plugin" aria-label="about this plugin permalink" class="anchor after"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a></h2>');
    });
    it('slugs should be stripped', async () => {
        const options = {};
        const htmlAst = await rehypeParser.parse('<h1>\n    \nsomething\n   \n</h1>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<h1 id="something" style="position: relative"><a href="#something" aria-label="something permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>\n    \nsomething\n   \n</h1>');
    });
    it('prepend id', async () => {
        const options = {prependId: 'plugin-content-'};
        const htmlAst = await rehypeParser.parse('<h1>something</h1>');
        const updatedHtmlAst = pluginFunc({htmlAst}, options);
        expect(toHtml(updatedHtmlAst)).toEqual('<h1 id="plugin-content-something" style="position: relative"><a href="#plugin-content-something" aria-label="something permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>something</h1>');
    });
    describe('limited elements', () => {
        it('include element', async () => {
            const options = {
                elements: ['h2'],
            };
            const htmlAst = await rehypeParser.parse('<h2 dir="auto" style="color: red">About this plugin</h2>');
            const updatedHtmlAst = pluginFunc({htmlAst}, options);
            expect(toHtml(updatedHtmlAst)).toEqual('<h2 dir="auto" style="color: red; position: relative" id="about-this-plugin"><a href="#about-this-plugin" aria-label="about this plugin permalink" class="anchor before"><svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>About this plugin</h2>');
        });
        it('exclude element', async () => {
            const options = {
                elements: ['h1'],
            };
            const htmlAst = await rehypeParser.parse('<h2 dir="auto" style="color: red">About this plugin</h2>');
            const updatedHtmlAst = pluginFunc({htmlAst}, options);
            expect(toHtml(updatedHtmlAst)).toEqual('<h2 dir="auto" style="color: red">About this plugin</h2>');
        });
    });
});
