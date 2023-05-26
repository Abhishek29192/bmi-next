import type { MigrationFunction } from "contentful-migration";

export const description = "Impose a minimum of two cards";

export const up: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards").validations([{ size: { min: 2 } }]);
};

export const down: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards").validations([]);
};
