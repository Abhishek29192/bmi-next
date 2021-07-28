"use strict";

module.exports.description = "Add link type filed";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");
  link
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Internal", "External", "Asset"] }]);
  link.moveField("type").afterField("label");
  link.changeFieldControl("type", "builtin", "dropdown");

  migration.transformEntries({
    contentType: "link",
    from: ["linkedPage"],
    to: ["type"],
    transformEntryForLocale: (fromFields) =>
      fromFields.linkedPage ? { type: "Internal" } : { type: "External" }
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");
  link.deleteField("type");
};
