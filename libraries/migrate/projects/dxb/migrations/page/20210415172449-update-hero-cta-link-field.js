"use strict";

module.exports.description = "update hero CTA link field";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 and Spotlight heroes"
  });
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 heroes"
  });
};
