import type { MigrationFunction } from "contentful-migration";

export const description = "Remove unused description from villain section";

export const up: MigrationFunction = (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.editField("description").disabled(true).omitted(true);
};

export const down: MigrationFunction = (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.editField("description").disabled(false).omitted(false);
};
