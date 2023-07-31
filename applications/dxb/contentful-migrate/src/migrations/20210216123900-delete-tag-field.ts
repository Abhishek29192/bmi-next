import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from page content type";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("tag");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
