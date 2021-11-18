module.exports.description = "Add teamCategory to sections";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "teamSection"]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
          (entryType) => entryType !== "teamSection"
        )
      }
    ],
    linkType: "Entry"
  });
};
