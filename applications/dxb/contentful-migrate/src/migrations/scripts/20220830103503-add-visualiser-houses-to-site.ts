import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add visualiser house types to the site";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("site");

  resources
    .createField("visualiserHouseTypes")
    .name("Visualiser House Types")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["visualiserHouseType"] }]
    });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("site");
  resources.deleteField("visualiserHouseTypes");
};
