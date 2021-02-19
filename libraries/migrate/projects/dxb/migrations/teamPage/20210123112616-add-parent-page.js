module.exports.description = "Add parentPage field to teamPage content type.";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage
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
  const teamPage = migration.editContentType("teamPage");
  teamPage.deleteField("parentPage");
};
