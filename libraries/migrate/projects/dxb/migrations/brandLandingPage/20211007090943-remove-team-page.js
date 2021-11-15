module.exports.description =
  "Remove team page field from brandLandingPage parentPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("brandLandingPage");

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
  const page = migration.editContentType("brandLandingPage");

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
