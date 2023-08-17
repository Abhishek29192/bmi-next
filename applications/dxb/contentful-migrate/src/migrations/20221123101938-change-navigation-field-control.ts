import type { MigrationFunction } from "contentful-migration";

export const description = "Change the Navigation links field control";

export const up: MigrationFunction = (migration) => {
  const navigation = migration.editContentType("navigation");

  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    bulkEditing: false
  });
};

export const down: MigrationFunction = (migration) => {
  const navigation = migration.editContentType("navigation");

  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    bulkEditing: true
  });
};
