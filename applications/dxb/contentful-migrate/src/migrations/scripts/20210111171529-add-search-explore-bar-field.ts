import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add search page explore bar to resources content type";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageExploreBar")
    .name("Search Page: Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageExploreBar");
};
