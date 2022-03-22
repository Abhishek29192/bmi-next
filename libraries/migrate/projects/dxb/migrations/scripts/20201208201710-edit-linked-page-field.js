"use strict";

const {
  getLinkContentTypeValidations
} = require("../../../../utils/fieldValidations");

const diffEntryTypes = ["documentLibraryPage", "homePage"];

module.exports.description = `Add ${diffEntryTypes.join(
  ", "
)} to linked page field validations`;

module.exports.up = async (migration, { makeRequest }) => {
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

module.exports.down = async (migration, { makeRequest }) => {
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
