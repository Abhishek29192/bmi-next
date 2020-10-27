"use strict";

module.exports.description = "Add tag field link to content type tag";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage.deleteField("tag");
};
