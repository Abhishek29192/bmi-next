import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.deleteField("tag");
};
