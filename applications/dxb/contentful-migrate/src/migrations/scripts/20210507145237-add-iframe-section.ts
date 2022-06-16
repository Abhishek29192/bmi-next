import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Iframe section content";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("iframe")
    .name("Iframe")
    .type("Link")
    .validations([{ linkContentType: ["iframe"] }])
    .linkType("Entry");

  contactUsPage.moveField("iframe").afterField("locations");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("contactUsPage").deleteField("iframe");
};
