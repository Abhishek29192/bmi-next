"use strict";

module.exports.description = "Add hero CTA link field";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 heroes"
  });

  page.moveField("cta").afterField("heroType");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("cta");
};
