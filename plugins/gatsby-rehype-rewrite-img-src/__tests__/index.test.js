const Rehype = require('rehype');
const toHtml = require('hast-util-to-html');

const pluginFunc = require('../index');

describe('handler', () => {
    const rehype = new Rehype().data('settings', {
        fragment: true,
        space: 'html',
        emitParseErrors: false,
        verbose: false,
    }); // Load language extension if defined

    it('should rewrite relative urls', async () => {
        const htmlAst = await rehype.parse('<img src="foo/bar.jpg" />');
        const htmlNode = {
            context: {
                url: 'http://example.com/subdir/readme.md'
            }
        };
        const updatedHtmlAst = pluginFunc({htmlAst, htmlNode});
        expect(toHtml(updatedHtmlAst)).toBe('<img src="http://example.com/subdir/foo/bar.jpg">');
    });
    it('should not touch absolute urls urls', async () => {
        const htmlAst = await rehype.parse('<img src="https://google.com/subdir/foo/bar.jpg" />');
        const htmlNode = {
            context: {
                url: 'http://example.com/subdir/readme.md'
            }
        };
        const updatedHtmlAst = pluginFunc({htmlAst, htmlNode});
        expect(toHtml(updatedHtmlAst)).toBe('<img src="https://google.com/subdir/foo/bar.jpg">');
    });
});
