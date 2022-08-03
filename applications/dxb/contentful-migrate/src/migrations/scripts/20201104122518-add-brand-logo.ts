import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add brand logo field to page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page
    .createField("brandLogo")
    .name("Brand Logo")
    .type("Symbol")
    .validations([
      { in: ["Icopal", "Zanda", "Monier", "Monarplan", "AeroDek"] }
    ]);

  page.moveField("brandLogo").afterField("featuredImage");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.deleteField("brandLogo");
};
