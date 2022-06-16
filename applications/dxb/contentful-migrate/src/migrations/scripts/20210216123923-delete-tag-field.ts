import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from promo page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.deleteField("tag");
};
