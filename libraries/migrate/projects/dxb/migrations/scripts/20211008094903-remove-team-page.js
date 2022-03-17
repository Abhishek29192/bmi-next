module.exports.description = "Remove team page links from resources.";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, ctx) => {
  const page = migration.editContentType("resources");

  //pdpCards
  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    page.id,
    "pdpCards"
  );

  const validations = getItemsValidations();

  page.editField("pdpCards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: validations.filter((entry) => entry !== "teamPage") }
    ]
  });

  //nba
  const { getItemsValidations: getItemsValidations2 } =
    await getFieldValidations(
      ctx.makeRequest,
      page.id,
      "searchPageNextBestActions"
    );

  const validations2 = getItemsValidations2();

  page.editField("searchPageNextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: validations2.filter((entry) => entry !== "teamPage") }
    ]
  });
};

module.exports.down = async (migration, ctx) => {
  const page = migration.editContentType("resources");

  //pdp
  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "pdpCards"
  );

  const validations = getItemsValidations();

  page.editField("pdpCards").items({
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [...validations, "teamPage"] }]
  });

  //nba
  const { getItemsValidations: getItemsValidations2 } =
    await getFieldValidations(
      ctx.makeRequest,
      contentType.id,
      "searchPageNextBestActions"
    );

  const validations2 = getItemsValidations2();

  page.editField("searchPageNextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [...validations2, "teamPage"] }]
  });
};
