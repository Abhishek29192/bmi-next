"use strict";

module.exports.description = "Add Document Library to Card Sections";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    cardCollectionSection.id,
    "cards"
  );

  cardCollectionSection.editField("cards").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "documentLibraryPage"]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    cardCollectionSection.id,
    "cards"
  );

  cardCollectionSection.editField("cards").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
          (entryType) => entryType !== "documentLibraryPage"
        )
      }
    ],
    linkType: "Entry"
  });
};
