import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add CTA for Brand Landing Page";

export const up: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  brandLandingPage.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This cta will be used on the first slide of Brand Landing Page"
  });
  brandLandingPage.moveField("cta").afterField("description");
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.deleteField("cta");
};
