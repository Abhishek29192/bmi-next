import type { MigrationFunction } from "contentful-migration";

export const description = "Add head scripts to the site";

export const up: MigrationFunction = (migration) => {
  // Add your UP migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples

  const site = migration.editContentType("site");
  site
    .createField("scriptGOptLoad")
    .name("Google Optimize Load balancing ID")
    .type("Symbol");
};

export const down: MigrationFunction = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
  const site = migration.editContentType("site");
  site.deleteField("scriptGOptLoad");
};
