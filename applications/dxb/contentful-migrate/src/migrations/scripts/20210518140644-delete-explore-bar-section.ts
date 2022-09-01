import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Delete exploreBar section";

export const up: MigrationFunction = (migration: Migration) => {
  migration.editContentType("page").deleteField("exploreBar");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page
    .createField("exploreBar")
    .name("Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  page.moveField("exploreBar").afterField("nextBestActions");
  page.changeFieldControl("exploreBar", "builtin", "entryLinkEditor");
};
