import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add redirects to site";

export const up: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");
  site
    .createField("redirects")
    .name("Redirects")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["redirect"] }],
      linkType: "Entry"
    });
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");
  site.deleteField("redirects");
};
