import type { MigrationFunction } from "contentful-migration";

export const description = "Add general error to resources content type";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("errorGeneral")
    .name("Error: General")
    .type("Link")
    .validations([{ linkContentType: ["promo"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("errorGeneral");
};
