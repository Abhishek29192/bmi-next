import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "This migration will remove default unique field validation for microcopy key";

export const up: MigrationFunction = (migration: Migration) => {
  const resource = migration.editContentType("resource");

  resource.editField("key", {
    type: "Symbol",
    validations: []
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resource = migration.editContentType("resource");
  resource.editField("key", {
    type: "Symbol",
    validations: [{ unique: true }]
  });
};
