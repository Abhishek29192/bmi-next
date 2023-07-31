import type { MigrationFunction } from "contentful-migration";

export const description = "Remove Script GTM field from site";

export const up: MigrationFunction = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptGTM");
};

export const down: MigrationFunction = (migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptGTM").name("Google Tag Manager ID").type("Symbol");
};
