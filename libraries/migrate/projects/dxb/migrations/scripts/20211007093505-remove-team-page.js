module.exports.description = "Remove team page links from contactUsPage.";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, ctx) => {
  const page = migration.editContentType("contactUsPage");

  //remove from parentPage field
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

  //remove from nextBestActions field
  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    page.id,
    "nextBestActions"
  );

  const validations = getItemsValidations();

  page.editField("nextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: validations.filter((entry) => entry !== "teamPage") }
    ]
  });
};

module.exports.down = async (migration, ctx) => {
  const page = migration.editContentType("contactUsPage");

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

  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "nextBestActions"
  );

  const validations = getItemsValidations();

  page.editField("nextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [...validations, "teamPage"] }]
  });
};
