import type { MigrationFunction } from "contentful-migration";

export const description = "Add share widget link";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("pdpShareWidget")
    .name("Product Details Page: Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("pdpShareWidget");
};
