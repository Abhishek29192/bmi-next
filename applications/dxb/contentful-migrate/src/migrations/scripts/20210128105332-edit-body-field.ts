import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Edit required status of the body field";

export const up: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("body").required(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("body").required(true);
};
