"use strict";

module.exports.description = "Add share widget link";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("pdpShareWidget")
    .name("Product Details Page: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("pdpShareWidget");
};
