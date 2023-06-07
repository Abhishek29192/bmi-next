import type { MigrationFunction } from "contentful-migration";

export const description = "Add Text Card to Card Collection Section";

export const up: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([{ in: ["Highlight Card", "Story Card", "Text Card"] }]);
};

export const down: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([{ in: ["Highlight Card", "Story Card"] }]);
};
