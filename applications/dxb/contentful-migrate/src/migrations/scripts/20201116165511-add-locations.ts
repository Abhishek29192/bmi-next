import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add a location field that links to multiple contactDetails entries.";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("locationsTitle")
    .name("Locations Title")
    .type("Symbol");

  contactUsPage
    .createField("locations")
    .name("Locations")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactDetails"] }],
      linkType: "Entry"
    });

  contactUsPage.moveField("locationsTitle").afterField("queriesSubtitle");
  contactUsPage.moveField("locations").afterField("locationsTitle");
};

export const down: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.deleteField("locations");
  contactUsPage.deleteField("locationsTitle");
};
