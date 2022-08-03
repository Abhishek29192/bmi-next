import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Move sortOrder field";

export const up: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("cards");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("link");
};
