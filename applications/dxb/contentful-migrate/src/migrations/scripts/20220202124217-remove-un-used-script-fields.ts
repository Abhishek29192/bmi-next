import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "remove un-used script fields from the site";

export const up: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptHotJar");
  site.deleteField("scriptGA");
  site.deleteField("scriptGOptLoad");
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptHotJar").name("HotJar ID").type("Symbol");
  site.createField("scriptGA").name("Google Analytics ID").type("Symbol");
  site
    .createField("scriptGOptLoad")
    .name("Google Optimize Load balancing ID")
    .type("Symbol");
};
