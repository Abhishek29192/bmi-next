import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Rename brandLogo to brand for display purposes only, as changing the field itself will require a much greater change in the code (to be done later)";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("productListerPage");

  page.editField("brandLogo").name("Brand");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("productListerPage");

  page.editField("brandLogo").name("Brand Logo");
};
