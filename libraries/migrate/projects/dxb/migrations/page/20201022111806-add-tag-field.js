"use strict";

module.exports.description = "Add tag field link to content type tag";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("tag");
};
