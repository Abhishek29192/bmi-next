import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add no-index field.";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("seoContent");

  page
    .createField("noIndex")
    .name("Exclude from search")
    .type("Boolean")
    .required(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("seoContent");
  page.deleteField("noIndex");
};
