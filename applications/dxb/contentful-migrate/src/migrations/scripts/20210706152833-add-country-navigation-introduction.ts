import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Adds country navigation introduction field";

const fieldName = "countryNavigationIntroduction";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(fieldName)
    .name("Country navigation: Introduction")
    .type("RichText")
    .required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(fieldName);
};
