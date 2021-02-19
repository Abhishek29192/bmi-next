"use strict";

module.exports.description = "Add asset field";

module.exports.up = (migration) => {
  const link = migration
    .editContentType("link")
    .description("This links to a Page, Asset, or URL");
  link.createField("asset").name("Asset").type("Link").linkType("Asset");
  link.moveField("isLabelHidden").afterField("label");
  link.moveField("icon").afterField("type");
};

module.exports.down = (migration) => {
  const link = migration
    .editContentType("link")
    .description("This links to a Page or URL");
  link.deleteField("asset");
  link.moveField("icon").afterField("linkedPage");
  link.moveField("isLabelHidden").afterField("icon");
};
