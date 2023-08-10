import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add search page sidebar items to resources content type";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageSidebarItems")
    .name("Search Page: Sidebar Items")
    .type("Link")
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");
  resources
    .moveField("searchPageSidebarItems")
    .afterField("searchPageSearchTips");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageSidebarItems");
};
