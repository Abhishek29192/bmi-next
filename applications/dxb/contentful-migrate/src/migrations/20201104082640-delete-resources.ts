import type { MigrationFunction } from "contentful-migration";

export const description = "Deprecate current resources";

export const up: MigrationFunction = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("resources");
};

export const down: MigrationFunction = (migration) => {
  const site = migration.editContentType("site");

  site
    .createField("resources")
    .name("Resources")
    .type("Array")
    .items({ type: "Link", validations: [], linkType: "Entry" });
  site.changeFieldControl("resources", "builtin", "entryLinksEditor");

  site.moveField("resources").afterField("footerSecondaryNavigation");
};
