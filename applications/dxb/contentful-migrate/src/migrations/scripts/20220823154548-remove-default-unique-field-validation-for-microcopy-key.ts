import type { MigrationFunction } from "contentful-migration";

export const description =
  "This migration will remove default unique field validation for microcopy key";

export const up: MigrationFunction = (migration) => {
  const resource = migration.editContentType("resource");

  resource.editField("key", {
    type: "Symbol",
    validations: []
  });
};

export const down: MigrationFunction = (migration) => {
  const resource = migration.editContentType("resource");
  resource.editField("key", {
    type: "Symbol",
    validations: [{ unique: true }]
  });
};
