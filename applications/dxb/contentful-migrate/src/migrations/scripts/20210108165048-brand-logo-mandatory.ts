import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Impose brand logo mandatory";

export const up: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo").required(false);
};
