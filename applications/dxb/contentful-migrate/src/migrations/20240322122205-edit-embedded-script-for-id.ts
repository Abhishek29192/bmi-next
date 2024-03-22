import type { MigrationFunction } from "contentful-migration";

export const description =
  "Edit the id field of the embedded script section content type";

export const up: MigrationFunction = async (migration, context) => {
  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );

  embeddedScriptSection.editField("id", {
    newId: "scriptSectionId",
    type: "Symbol"
  });
};

export const down: MigrationFunction = async (migration, context) => {
  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );

  embeddedScriptSection.editField("scriptSectionId", {
    newId: "id",
    type: "Symbol"
  });
};
