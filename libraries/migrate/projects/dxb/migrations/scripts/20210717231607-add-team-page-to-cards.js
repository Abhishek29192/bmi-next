/**
 * @typedef { import("contentful-migration").MigrationFunction } MigrationFunction
 */

module.exports.description = "Add Team Page to Cards Section";

const getFieldValidations = require("../../../../utils/getFieldValidations");

/**
 * @type {MigrationFunction}
 */
module.exports.up = async (migration, ctx) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "cards"
  );

  /**  @type {string[]} */
  const validations = getItemsValidations();

  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [...validations, "teamPage"] }]
  });
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = async (migration, ctx) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { getItemsValidations } = await getFieldValidations(
    ctx.makeRequest,
    contentType.id,
    "cards"
  );

  /**  @type {string[]} */
  const validations = getItemsValidations();

  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: validations.filter((entry) => entry !== "teamPage") }
    ]
  });
};
