import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add help text for Explore Bar use";

export const up: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    helpText:
      "When using Navigation as a section, only `Link` content types can be used to make up the horizontal menu bar."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    helpText: ""
  });
};
