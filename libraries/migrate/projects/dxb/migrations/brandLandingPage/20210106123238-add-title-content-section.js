"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description =
  "Add titleWithContent to the brand landing page sections";

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
        linkContentType: [...getItemsValidations(), "titleWithContent", ""]
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
          (entryType) => entryType !== "titleWithContent"
        )
      }
    ],
    linkType: "Entry"
  });
};
