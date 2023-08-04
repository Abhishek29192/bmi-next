import type { MigrationFunction } from "contentful-migration";

export const description = "Delete tag field from contact us page content type";

export const up: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("tag");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
