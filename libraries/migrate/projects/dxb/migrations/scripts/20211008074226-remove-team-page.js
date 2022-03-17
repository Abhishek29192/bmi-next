module.exports.description =
  "Remove team page field from documentLibraryPage parentPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("documentLibraryPage");

  page.editField("parentPage").validations([
    {
      linkContentType: [
        "page",
        "contactUsPage",
        "homePage",
        "productListerPage",
        "documentLibraryPage",
        "brandLandingPage"
      ]
    }
  ]);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("documentLibraryPage");

  page.editField("parentPage").validations([
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
  ]);
};
