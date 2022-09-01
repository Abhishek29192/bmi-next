import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add error 404 to resources content type";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("errorFourOFour")
    .name("Error: 404")
    .type("Link")
    .validations([{ linkContentType: ["promo"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("errorFourOFour");
};
