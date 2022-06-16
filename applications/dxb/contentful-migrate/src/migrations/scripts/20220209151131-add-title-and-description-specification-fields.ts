import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create PDP specification title and description";

const titleField = "pdpSpecificationTitle";
const descriptionField = "pdpSpecificationDescription";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField(titleField)
    .name("Product Details Page: Specification title")
    .type("Symbol");

  resources
    .createField(descriptionField)
    .name("Product Details Page: Specification description")
    .type("RichText");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(titleField);
  resources.deleteField(descriptionField);
};
