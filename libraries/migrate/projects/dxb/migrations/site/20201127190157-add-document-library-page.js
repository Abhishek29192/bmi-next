"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description =
  "Add document library page to pages validation for page content type";

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
        linkContentType: [...getItemsValidations(), "documentLibraryPage"]
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
          (entryType) => entryType !== "documentLibraryPage"
        )
      }
    ],
    linkType: "Entry"
  });
};
