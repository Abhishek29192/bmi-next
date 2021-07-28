module.exports.description = "Deprecate current resources";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("resources");
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site
    .createField("resources")
    .name("Resources")
    .type("Array")
    .items({ type: "Link", validations: [], linkType: "Entry" });
  site.changeFieldControl("resources", "builtin", "entryLinksEditor");

  site.moveField("resources").afterField("footerSecondaryNavigation");
};
