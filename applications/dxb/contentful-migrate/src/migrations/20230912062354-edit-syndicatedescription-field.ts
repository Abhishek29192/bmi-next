import type { MigrationFunction } from "contentful-migration";

export const description = "Edit description field in SyndicateSection";

export const up: MigrationFunction = async (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.changeFieldControl("description", "builtin", "singleLine");
};

export const down: MigrationFunction = async (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.changeFieldControl("description", "builtin", "markdown");
};
