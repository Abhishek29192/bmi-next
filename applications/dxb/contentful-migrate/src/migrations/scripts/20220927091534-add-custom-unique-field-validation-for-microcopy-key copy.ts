// Duplicate of 20220823163256-add-custom-unique-field-validation-for-microcopy-key.ts
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "This migration will add custom unique field validation for microcopy key";

const UNIQUE_FIELDS_APP = "3boLz03AvMVs4noqM2ARqS";

export const up: MigrationFunction = async (migration: Migration) => {
  const resource = migration.editContentType("resource");

  resource.changeFieldControl("key", "app", UNIQUE_FIELDS_APP);
};

export const down: MigrationFunction = (migration: Migration) => {
  const resource = migration.editContentType("resource");

  resource.resetFieldControl("key");
};
