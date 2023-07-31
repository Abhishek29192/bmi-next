import type { MigrationFunction } from "contentful-migration";

export const description = "Add no-index field.";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("document");

  page
    .createField("noIndex")
    .name("Exclude from search")
    .type("Boolean")
    .required(false);
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("document");
  page.deleteField("noIndex");
};
