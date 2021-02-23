module.exports.description =
  "Add parentPage field to productListerPage content type.";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage
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
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("parentPage");
};
