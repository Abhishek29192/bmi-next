import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add order form to sample basket content type";

export const up: MigrationFunction = (migration: Migration) => {
  const sampleBasket = migration.editContentType("sampleBasket");

  sampleBasket
    .createField("checkoutFormSection")
    .name("Order Form")
    .type("Link")
    .validations([{ linkContentType: ["form"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.editContentType("sampleBasket").deleteField("checkoutFormSection");
