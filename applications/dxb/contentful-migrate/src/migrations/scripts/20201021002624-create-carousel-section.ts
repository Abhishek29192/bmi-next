import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Carousel Section";

export const up: MigrationFunction = (migration: Migration) => {
  const carouselSection = migration
    .createContentType("carouselSection")
    .name("Carousel Section")
    .displayField("title")
    .description("");

  carouselSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  carouselSection
    .createField("variant")
    .name("Variant")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["horizontal", "vertical"] }]);

  carouselSection
    .createField("slides")
    .name("Slides")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2, max: 6 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactUsPage", "promo", "page"] }],
      linkType: "Entry"
    });

  carouselSection
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  carouselSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText:
      "This field won't appear on the website, but it gets used to represent this entry"
  });
  carouselSection.changeFieldControl("variant", "builtin", "radio");
  carouselSection.changeFieldControl("slides", "builtin", "entryLinksEditor");
  carouselSection.changeFieldControl("link", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("carouselSection");
