import type { MigrationFunction } from "contentful-migration";

export const description = "Move sortOrder field";

export const up: MigrationFunction = (migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("cards");
};

export const down: MigrationFunction = (migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("link");
};
