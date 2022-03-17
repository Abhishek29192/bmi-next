module.exports.description =
  "Add parentPage field to brandLandingPage content type.";

module.exports.up = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page
    .createField("parentPage")
    .name("Parent Page")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "page",
          "contactUsPage",
          "teamPage",
          "homePage",
          "productListerPage",
          "documentLibraryPage",
          "brandLandingPage"
        ]
      }
    ])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("brandLandingPage");
  page.deleteField("parentPage");
};
