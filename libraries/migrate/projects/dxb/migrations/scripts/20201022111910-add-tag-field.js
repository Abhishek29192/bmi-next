"use strict";

module.exports.description = "Add tag field link to content type tag";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.deleteField("tag");
};
