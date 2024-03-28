import type { MigrationFunction } from "contentful-migration";

export const description = "Add optional title to EmbeddedScriptSection";

export const up: MigrationFunction = async (migration) => {
  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );

  embeddedScriptSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(false);

  embeddedScriptSection.moveField("title").afterField("name");
};

export const down: MigrationFunction = async (migration) => {
  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );

  embeddedScriptSection.deleteField("title");
};
