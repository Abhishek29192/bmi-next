"use strict";

module.exports.description = "Add Iframe section content";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("iframe")
    .name("Iframe")
    .type("Link")
    .validations([{ linkContentType: ["iframe"] }])
    .linkType("Entry");

  contactUsPage.moveField("iframe").afterField("locations");
};

module.exports.down = (migration) => {
  migration.editContentType("contactUsPage").deleteField("iframe");
};
