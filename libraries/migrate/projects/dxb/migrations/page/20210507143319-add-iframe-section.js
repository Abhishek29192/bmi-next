"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");

module.exports.description =
  "Add iframe section to sections validation for page content type";

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
        linkContentType: [...getItemsValidations(), "iframe"]
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
          (entryType) => entryType !== "iframe"
        )
      }
    ],
    linkType: "Entry"
  });
};
