module.exports.description = "Add CTA for Brand Landing Page";

module.exports.up = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  brandLandingPage.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This cta will be used on the first slide of Brand Landing Page"
  });
  brandLandingPage.moveField("cta").afterField("description");
};

module.exports.down = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.deleteField("cta");
};
