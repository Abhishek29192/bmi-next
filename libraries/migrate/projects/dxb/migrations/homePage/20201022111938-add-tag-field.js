"use strict";

module.exports.description = "Add tag field link to content type tag";

module.exports.up = (migration) => {
  const homePage = migration.editContentType("homePage");
  homePage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const homePage = migration.editContentType("homePage");
  homePage.deleteField("tag");
};
