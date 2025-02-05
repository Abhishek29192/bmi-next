import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Two Pane Carousel Section";

export const up: MigrationFunction = (migration) => {
  const twoPaneCarouselSection = migration
    .createContentType("twoPaneCarouselSection")
    .name("Two Pane Carousel Section")
    .displayField("title")
    .description("");

  twoPaneCarouselSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  twoPaneCarouselSection
    .createField("slides")
    .name("Slides")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactUsPage", "promo", "page"] }],
      linkType: "Entry"
    });

  twoPaneCarouselSection
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  twoPaneCarouselSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText:
      "This field won't appear on the website, but it gets used to represent this entry"
  });
  twoPaneCarouselSection.changeFieldControl(
    "slides",
    "builtin",
    "entryLinksEditor"
  );
  twoPaneCarouselSection.changeFieldControl(
    "link",
    "builtin",
    "entryLinkEditor"
  );
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("twoPaneCarouselSection");
