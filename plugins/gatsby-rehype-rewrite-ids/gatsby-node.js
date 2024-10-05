"use strict";

exports.pluginOptionsSchema = function (_ref) {
  var Joi = _ref.Joi;
  return Joi.object({
    prefix: Joi.string().default("").description("Add this before each id"),
    elements: Joi.array().items(Joi.string()).description("Specify which type of header tags to link.")
  });
};
