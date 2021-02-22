"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description = "Add Syndicate to the sections";

module.exports.up = async (migration, { makeRequest }) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    brandLandingPage.id,
    "sections"
  );

  brandLandingPage.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "villainSection", ""]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    brandLandingPage.id,
    "sections"
  );

  brandLandingPage.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
          (entryType) => entryType !== "villainSection"
        )
      }
    ],
    linkType: "Entry"
  });
};
