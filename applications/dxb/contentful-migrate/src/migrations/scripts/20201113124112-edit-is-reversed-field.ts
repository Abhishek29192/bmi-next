import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Changed required status of is reversed field";

export const up: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");
  syndicateSection.editField("isReversed").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");
  syndicateSection.editField("isReversed").required(false);
};
