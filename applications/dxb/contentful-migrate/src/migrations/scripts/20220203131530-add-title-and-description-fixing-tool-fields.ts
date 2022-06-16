import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create PDP fixing tool title and description";

const titleField = "pdpFixingToolTitle";
const descriptionField = "pdpFixingToolDescription";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField(titleField)
    .name("Product Details Page: Fixing Tool title")
    .type("Symbol");

  resources
    .createField(descriptionField)
    .name("Product Details Page: Fixing Tool description")
    .type("RichText");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(titleField);
  resources.deleteField(descriptionField);
};
