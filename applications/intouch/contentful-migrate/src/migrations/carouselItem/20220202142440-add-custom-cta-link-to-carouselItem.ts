import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Create new custom external link CTA for Carousel Item";

export const up: MigrationFunction = (migration: Migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("cta", {
    type: "Symbol",
    validations: [
      { in: ["PROJECT", "TRAINING", "MERCHANDISE", "CUSTOM", "NONE"] }
    ]
  });

  carouselItem.createField("customUrl").name("Custom CTA URL").type("Symbol");
  carouselItem
    .createField("customUrlButtonText")
    .name("Custom CTA URL Button Text")
    .type("Symbol");

  carouselItem.moveField("customUrl").afterField("cta");
  carouselItem.moveField("customUrlButtonText").afterField("customUrl");

  carouselItem.changeFieldControl("cta", "builtin", "radio");
  carouselItem.changeFieldControl("customUrl", "builtin", "singleLine", {
    helpText: "The custom CTA URL when select 'CUSTOM' from CTA Field"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("cta", {
    type: "Symbol",
    validations: [{ in: ["PROJECT", "TRAINING", "MERCHANDISE", "NONE"] }]
  });

  carouselItem.changeFieldControl("cta", "builtin", "radio");

  carouselItem.deleteField("customUrl");
  carouselItem.deleteField("customUrlButtonText");
};
