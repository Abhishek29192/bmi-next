import type { MigrationFunction } from "contentful-migration";

export const description = "Add description field";

export const up: MigrationFunction = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.createField("description").name("Description").type("Text");

  syndicateSection.moveField("description").afterField("title");
};

export const down: MigrationFunction = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.deleteField("description");
};
