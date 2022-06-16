import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from contact us page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("tag");
};
