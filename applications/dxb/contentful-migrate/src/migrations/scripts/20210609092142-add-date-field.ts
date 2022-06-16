import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add date field";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.createField("date").name("Date").type("Date");
  page.moveField("date").afterField("leadBlock");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("page").deleteField("date");
};
