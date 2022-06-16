import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove next best action card validation";

export const up: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([{ in: ["Highlight Card", "Story Card"] }]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([
      { in: ["Highlight Card", "Story Card", "Next Best Action Card"] }
    ]);
};
