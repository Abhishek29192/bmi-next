module.exports.description =
  "Add parentPage field to documentLibraryPage content type.";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
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
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.deleteField("parentPage");
};
