import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add resources to the site";

export const up: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site
    .createField("resources")
    .name("Resources")
    .type("Link")
    .validations([{ linkContentType: ["resources"] }])
    .linkType("Entry");

  site.changeFieldControl("resources", "builtin", "entryLinkEditor", {
    helpText:
      "Use this field to create the global settings and resources for this site."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.deleteField("resources");
};
