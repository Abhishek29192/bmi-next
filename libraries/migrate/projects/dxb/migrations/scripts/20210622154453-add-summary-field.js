"use strict";

module.exports.description = "Add summary RichText field";

const {
  enabledNodeTypes,
  nodes
} = require("../../variables/richText/20210413104316");

module.exports.up = (migration) => {
  const iframe = migration.editContentType("iframe");

  iframe
    .createField("summary")
    .name("Summary")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes,
        message: `Only the following nodes are allowed: ${enabledNodeTypes.join(
          ", "
        )}`
      },
      {
        nodes
      }
    ]);

  iframe.moveField("summary").afterField("title");
};

module.exports.down = (migration) => {
  migration.editContentType("iframe").deleteField("summary");
};
