import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Change the Navigation links field control";

export const up: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");

  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    bulkEditing: false
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");

  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    bulkEditing: true
  });
};
