"use strict";
const { getAllContentTypes } = require("../../../../utils/makeRequestUtils");

module.exports.description = "localise all content type fields";

module.exports.up = async (migration, { makeRequest }) => {
  const allContentTypes = await getAllContentTypes(makeRequest);
  allContentTypes.items
    .filter((ctype) => ctype.sys.id !== "migration")
    .forEach((ct) => {
      const migrationContentType = migration.editContentType(ct.sys.id);
      ct.fields.forEach((field) => {
        if (!field.localized) {
          migrationContentType.editField(field.id).localized(true);
        }
      });
    });
};

module.exports.down = async (migration, { makeRequest }) => {
  // Below are the content type fields which had localisation set to true
  // when this migration is created. Technically this not a 100% reversal.
  // But this is good enough for dev purposes. Production roll back can/should
  // use backups instead.
  const exclude = {
    form: ["title", "description", "submitText"],
    sampleBasket: [
      "title",
      "description",
      "emptyBasketMessage",
      "browseProductsCTALabel"
    ]
  };
  const allContentTypes = await getAllContentTypes(makeRequest);
  allContentTypes.items
    .filter((ctype) => ctype.sys.id !== "migration")
    .forEach((ct) => {
      const migrationContentType = migration.editContentType(ct.sys.id);
      ct.fields.forEach((field) => {
        if (
          field.localized &&
          (!exclude.hasOwnProperty(ct.sys.id) ||
            !exclude[ct.sys.id].includes(field.id))
        ) {
          migrationContentType.editField(field.id).localized(false);
        } else {
          console.log(`Skip Content type: ${ct.sys.id} -> Field ${field.id}`);
        }
      });
    });
};
