import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from home page content type";

export const up: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.deleteField("tag");
};
