"use strict";

module.exports.description = "Add visualiser share widget section link";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("visualiserShareWidget")
    .name("Visualiser: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("visualiserShareWidget");
};
