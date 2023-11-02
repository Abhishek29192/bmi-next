import type { MigrationFunction } from "contentful-migration";

export const description =
  "Edit description field in SyndicateSection as multiline";

export const up: MigrationFunction = async (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.changeFieldControl("description", "builtin", "multipleLine");
};

export const down: MigrationFunction = async (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.changeFieldControl("description", "builtin", "singleLine");
};
