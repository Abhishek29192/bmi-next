import type { MigrationFunction } from "contentful-migration";

export const description = "Add Tools field to Account Page content type";

export const up: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage
    .createField("tools")
    .name("Tools")
    .type("Link")
    .validations([{ linkContentType: ["accountLink"] }])
    .linkType("Entry")
    .localized(true);

  accountPage.moveField("tools").afterField("allowTools");
};

export const down: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.deleteField("tools");
};
