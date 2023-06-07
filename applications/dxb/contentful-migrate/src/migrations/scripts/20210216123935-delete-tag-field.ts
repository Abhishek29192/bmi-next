import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from team page content type";

export const up: MigrationFunction = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage.deleteField("tag");
};
