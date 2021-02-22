"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description =
  "Add document download section to sections validation for page content type";

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
        linkContentType: [...getItemsValidations(), "documentDownloadSection"]
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
          (entryType) => entryType !== "documentDownloadSection"
        )
      }
    ],
    linkType: "Entry"
  });
};
