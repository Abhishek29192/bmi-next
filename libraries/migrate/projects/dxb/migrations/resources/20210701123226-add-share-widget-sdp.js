"use strict";

module.exports.description = "Add share widget link on SDP";

const field = "sdpShareWidget";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
