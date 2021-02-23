"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description =
  "Add Brand Landing Page to pages validation for page content type";

module.exports.up = async (migration, { makeRequest }) => {
  const site = migration.editContentType("site");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "brandLandingPage"]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const site = migration.editContentType("site");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
          (entryType) => entryType !== "brandLandingPage"
        )
      }
    ],
    linkType: "Entry"
  });
};
