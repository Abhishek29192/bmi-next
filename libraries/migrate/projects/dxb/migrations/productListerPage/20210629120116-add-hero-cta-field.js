module.exports.description = "Add hero CTA link field";

module.exports.up = (migration) => {
  const page = migration.editContentType("productListerPage");
  page
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 and Spotlight heroes"
  });

  page.moveField("cta").afterField("heroType");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("productListerPage");
  page.deleteField("cta");
};
