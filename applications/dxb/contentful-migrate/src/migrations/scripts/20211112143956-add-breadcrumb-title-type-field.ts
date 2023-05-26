import type { MigrationFunction } from "contentful-migration";

export const description = "Add breadcrumb title field to page.";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("breadcrumbTitle");
};
