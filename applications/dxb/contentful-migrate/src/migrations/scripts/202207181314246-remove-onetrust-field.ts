import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove scriptOnetrust from the site";

export const up: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptOnetrust");
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptOnetrust").name("OneTrust ID").type("Symbol");
};
