import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create sample basket content type";

export const up: MigrationFunction = (migration: Migration) => {
  const sampleBasket = migration
    .createContentType("sampleBasket")
    .name("Sample Basket Section")
    .displayField("title")
    .description("");

  sampleBasket
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true);

  sampleBasket
    .createField("description")
    .name("Description")
    .type("RichText")
    .localized(true);
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("sampleBasket");
