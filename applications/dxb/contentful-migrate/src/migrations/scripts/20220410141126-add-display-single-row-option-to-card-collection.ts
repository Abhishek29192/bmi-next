import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add single row display option to card collection content type";

const contentType = "cardCollectionSection";
const fieldName = "displaySingleRow";

export const up: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration.editContentType(contentType);

  cardCollectionSection
    .createField(fieldName)
    .name("Display on a single row")
    .type("Boolean");

  cardCollectionSection.changeFieldControl(fieldName, "builtin", "boolean");
};

export const down: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration.editContentType(contentType);
  cardCollectionSection.deleteField(fieldName);
};
