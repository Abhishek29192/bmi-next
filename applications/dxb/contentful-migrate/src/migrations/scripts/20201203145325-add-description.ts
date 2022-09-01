import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Long Description for Brand Landing Page";

export const up: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage
    .createField("description")
    .name("Long Description")
    .type("Text")
    .required(true);

  brandLandingPage.changeFieldControl(
    "description",
    "builtin",
    "multipleLine",
    {
      helpText: "This text will be used as a first slide on Brand Landing Page."
    }
  );

  brandLandingPage.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText:
      "This text will be used on the homepage rather than the Brand Landing Page."
  });
  brandLandingPage.moveField("description").afterField("subtitle");
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.deleteField("description");
  brandLandingPage.changeFieldControl("subtitle", "builtin", "singleLine");
};
