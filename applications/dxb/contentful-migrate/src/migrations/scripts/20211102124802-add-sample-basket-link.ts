import type { MigrationFunction } from "contentful-migration";

export const description = "Add link to sample basket";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("sampleBasketLink")
    .name("Samples Basket Link")
    .type("Link")
    .validations([{ linkContentType: ["page"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("sampleBasketLink");
};
