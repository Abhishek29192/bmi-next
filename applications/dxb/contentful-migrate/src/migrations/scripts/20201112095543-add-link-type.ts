import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add link type filed";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
  const link = migration.editContentType("link");
  link.deleteField("type");
};
