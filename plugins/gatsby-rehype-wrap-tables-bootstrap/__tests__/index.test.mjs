import Rehype from 'rehype';
import {toHtml} from 'hast-util-to-html';

import pluginFunc from '../index.mjs';

describe('handler', () => {
    const rehype = new Rehype().data('settings', {
        fragment: true,
        space: 'html',
        emitParseErrors: false,
        verbose: false,
    }); // Load language extension if defined

    const runPluginFunc = (htmlAst) => {
        return pluginFunc({
            htmlAst,
            compiler: {
                parseString: rehype.parse.bind(rehype)
            }
        });
    };

    it('basic test', async () => {
        const htmlAst = await rehype.parse('<div><table><tr><td>col 1</td></tr></table></div>');
        const updatedHtmlAst = runPluginFunc(htmlAst);
        expect(toHtml(updatedHtmlAst)).toBe('<div><div class="table-responsive"><table class="table table-bordered"><tbody><tr><td>col 1</td></tr></tbody></table></div></div>');
    });
});
