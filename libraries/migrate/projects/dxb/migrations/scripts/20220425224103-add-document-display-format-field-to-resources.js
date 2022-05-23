"use strict";

module.exports.description = "Add document display format on resources";

const field = "documentDisplayFormat";
const contentType = "resources";

module.exports.up = (migration) => {
  const resources = migration.editContentType(contentType);
  resources
    .createField(field)
    .name("Document display format")
    .type("Symbol")
    .validations([{ in: ["Asset type", "Asset name"] }])
    .required(true);

  migration.transformEntries({
    contentType,
    from: [],
    to: [field],
    transformEntryForLocale: async () => ({
      documentDisplayFormat: "Asset type"
    })
  });
};

module.exports.down = (migration) => {
  const resources = migration.editContentType(contentType);
  resources.deleteField(field);
};
