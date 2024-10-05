const Rehype = require(`rehype`);
const toHtml = require(`hast-util-to-html`);

const pluginFunc = require(`../index`);

describe(`handler`, () => {
  const rehype = new Rehype().data(`settings`, {
    fragment: true,
    space: `html`,
    emitParseErrors: false,
    verbose: false,
  }); // Load language extension if defined

  it(`should rewrite when prefix is provided`, async () => {
    const options = {
      prefix: `plugin_content_`,
    };
    const htmlAst = await rehype.parse(`<div><a href="#place_one">Place One</a><h1 id="place_one">something</h1></div>`);
    const updatedHtmlAst = pluginFunc({htmlAst}, options);
    expect(toHtml(updatedHtmlAst)).toEqual(`<div><a href="#plugin_content_place_one">Place One</a><h1 id="plugin_content_place_one">something</h1></div>`);
  });
});
