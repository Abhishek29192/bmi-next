import type { MigrationFunction } from "contentful-migration";

export const description = "Change Tools field type to array";

export const up: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.deleteField("tools");

  accountPage
    .createField("tools")
    .name("Tools")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["accountLink"] }]
    })
    .localized(true);

  accountPage.moveField("tools").afterField("allowTools");
};

export const down: MigrationFunction = async (migration) => {
  const accountPage = migration.editContentType("accountPage");

  accountPage.deleteField("tools");

  accountPage
    .createField("tools")
    .name("Tools")
    .type("Link")
    .validations([{ linkContentType: ["accountLink"] }])
    .linkType("Entry")
    .localized(true);

  accountPage.moveField("tools").afterField("allowTools");
};
