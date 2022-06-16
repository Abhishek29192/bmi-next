import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Rename Tag content type to Category";

export const up: MigrationFunction = (migration: Migration) => {
  const tagType = migration.editContentType("tag");

  tagType.name("Category");
};

export const down: MigrationFunction = (migration: Migration) => {
  const tag = migration.editContentType("tag");

  tag.name("Tag");
};
