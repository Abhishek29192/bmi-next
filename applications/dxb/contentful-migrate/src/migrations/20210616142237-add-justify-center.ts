import type { MigrationFunction } from "contentful-migration";

export const description = "Add justify center option";

const contentType = "cardCollectionSection";
const fieldName = "justifyCenter";

export const up: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);

  cardCollectionSection
    .createField(fieldName)
    .name("Justify Center")
    .type("Boolean");

  cardCollectionSection.changeFieldControl(fieldName, "builtin", "boolean");
};

export const down: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);
  cardCollectionSection.deleteField(fieldName);
};
