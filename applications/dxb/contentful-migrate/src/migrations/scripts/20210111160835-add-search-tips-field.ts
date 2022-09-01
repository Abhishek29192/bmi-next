import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add search page search tips to resources content type";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageSearchTips")
    .name("Search Page: Search Tips")
    .type("Link")
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageSearchTips");
};
