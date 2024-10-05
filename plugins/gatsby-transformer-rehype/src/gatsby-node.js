exports.createSchemaCustomization = require(`./create-schema-customization`);
exports.onCreateNode = require(`./on-node-create`);
exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`);

exports.pluginOptionsSchema = function({Joi}) {
  return Joi.object({
    filter: Joi.function().default(() => false),
    source: Joi.function().default((n) => n.html),
    contextFields: Joi.array().items(Joi.string()).default([`url`, `slug`, `feature_image`]),
    type: Joi.string().default(`HtmlRehype`),
    fragment: Joi.string().default(`HtmlRehype`),
    space: Joi.string().description(`Space mode`).default(`html`),
    emitParseErrors: Joi.boolean().description(`EmitParseErrors mode`).default(`false`),
    verbose: Joi.boolean().description(`verbose mode`).default(`false`),
    plugins: Joi.subPlugins(),
  });
};

