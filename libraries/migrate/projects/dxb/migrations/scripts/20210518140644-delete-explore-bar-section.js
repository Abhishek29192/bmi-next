"use strict";

module.exports.description = "Delete exploreBar section";

module.exports.up = (migration) => {
  migration.editContentType("page").deleteField("exploreBar");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("exploreBar")
    .name("Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  page.moveField("exploreBar").afterField("nextBestActions");
  page.changeFieldControl("exploreBar", "builtin", "entryLinkEditor");
};
