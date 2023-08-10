import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from promo page content type";

export const up: MigrationFunction = (migration) => {
  const promo = migration.editContentType("promo");

  promo.deleteField("tag");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
