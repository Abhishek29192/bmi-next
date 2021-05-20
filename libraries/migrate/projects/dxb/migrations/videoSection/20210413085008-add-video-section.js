"use strict";

const {
  enabledNodeTypes,
  nodes
} = require("../../variables/richText/20210413104316");

module.exports.description = "Create video section";

module.exports.up = (migration) => {
  const videoSection = migration
    .createContentType("videoSection")
    .name("Video Section")
    .displayField("name")
    .description("");

  videoSection.createField("name").name("Name").type("Symbol").required(true);

  videoSection.createField("title").name("Title").type("Symbol");

  videoSection
    .createField("description")
    .name("Description")
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

  videoSection
    .createField("video")
    .name("Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  videoSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "This field won't appear on the website, but it gets used to represent this entry"
  });
};

module.exports.down = (migration) =>
  migration.deleteContentType("videoSection");
