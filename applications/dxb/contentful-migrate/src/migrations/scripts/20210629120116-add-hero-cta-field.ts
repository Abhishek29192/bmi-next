import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add hero CTA link field";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("productListerPage");
  page
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 and Spotlight heroes"
  });

  page.moveField("cta").afterField("heroType");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("productListerPage");
  page.deleteField("cta");
};
