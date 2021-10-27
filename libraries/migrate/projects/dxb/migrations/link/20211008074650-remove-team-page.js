const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description = `Remove team page from linked page field validations`;

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    link.id,
    "linkedPage"
  );

  const validations = getItemsValidations();

  link.editField("linkedPage").validations = [
    { linkContentType: validations.filter((entry) => entry !== "teamPage") }
  ];
};

module.exports.down = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    link.id,
    "linkedPage"
  );

  const validations = getItemsValidations();

  link.editField("linkedPage").validations = [
    { linkContentType: [...validations, "teamPage"] }
  ];
};
