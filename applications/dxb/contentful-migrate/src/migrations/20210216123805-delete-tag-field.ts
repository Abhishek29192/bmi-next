import type { MigrationFunction } from "contentful-migration";

export const description =
  "Delete tag field from brand landing page content type";

export const up: MigrationFunction = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage.deleteField("tag");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
