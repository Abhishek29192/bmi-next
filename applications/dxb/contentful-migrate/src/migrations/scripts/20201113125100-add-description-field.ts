import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add description field";

export const up: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.createField("description").name("Description").type("Text");

  syndicateSection.moveField("description").afterField("title");
};

export const down: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.deleteField("description");
};
