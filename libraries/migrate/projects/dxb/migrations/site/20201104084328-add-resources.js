module.exports.description = "Add resources to the site";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site
    .createField("resources")
    .name("Resources")
    .type("Link")
    .validations([{ linkContentType: ["resources"] }])
    .linkType("Entry");

  site.changeFieldControl("resources", "builtin", "entryLinkEditor", {
    helpText:
      "Use this field to create the global settings and resources for this site."
  });
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("resources");
};
