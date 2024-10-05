const visit = require(`unist-util-visit`);
const merge = require(`lodash/merge`);

const pluginDefaults = {
  prefix: false,
};

module.exports = ({htmlAst}, pluginOptions) => {
  const {
    prefix,
  } = merge({}, pluginDefaults, pluginOptions);

  const visitNode = (node) => {
    node.properties = {...node.properties || {}};
    if (node.properties.id) {
      node.properties.id = `${prefix}${node.properties.id}`;
    }
    if (node.properties.href && node.properties.href.startsWith(`#`)) {
      node.properties.href = node.properties.href.replace(`#`, `#${prefix}`);
    }
    return node;
  };
  if (prefix) {
    visit(htmlAst, (node) => node?.properties?.id || node?.properties?.href, visitNode);
  }

  return htmlAst;
};
