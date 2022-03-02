module.exports.description =
  "Remove team page links from productListerPage page.";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, ctx) => {
  const page = migration.editContentType("productListerPage");

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

module.exports.down = async (migration, ctx) => {
  const page = migration.editContentType("productListerPage");

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
