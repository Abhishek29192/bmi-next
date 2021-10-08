const {
  getLinkContentTypeValidations
} = require("../../../../utils/fieldValidations");

const diffEntryTypes = ["teamPage"];

module.exports.description = `Remove team page from linked page field validations`;

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { linkContentType } = await getLinkContentTypeValidations(
    makeRequest,
    link.id,
    "linkedPage"
  );

  link.editField("linkedPage").validations([
    {
      linkContentType: [
        ...linkContentType.filter(
          (entryType) => !diffEntryTypes.includes(entryType)
        )
      ]
    }
  ]);
};

module.exports.down = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { linkContentType } = await getLinkContentTypeValidations(
    makeRequest,
    link.id,
    "linkedPage"
  );

  link.editField("linkedPage").validations([
    {
      linkContentType: [...linkContentType, ...diffEntryTypes]
    }
  ]);
};
