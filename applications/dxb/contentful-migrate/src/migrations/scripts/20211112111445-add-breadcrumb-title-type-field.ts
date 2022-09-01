import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add breadcrumb title field to brandLandingPage.";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("brandLandingPage");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.deleteField("breadcrumbTitle");
};
