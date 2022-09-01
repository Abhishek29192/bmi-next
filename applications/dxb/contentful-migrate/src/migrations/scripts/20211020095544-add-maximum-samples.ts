import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create Maximum Samples";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("maximumSamples")
    .name("Maximum Samples")
    .type("Number");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("maximumSamples");
};
