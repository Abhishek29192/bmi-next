module.exports.description = "Remove Team Page from Cards Section";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, ctx) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "cards"
  );

  const validations = getItemsValidations();

  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: validations.filter((entry) => entry !== "teamPage") }
    ]
  });
};

module.exports.down = async (migration, ctx) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "cards"
  );

  const validations = getItemsValidations();

  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [...validations, "teamPage"] }]
  });
};
