import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { MAX_FILE_SIZES } from "../../variables/mediaSizes/20210222125604";
import tiers from "../../variables/tiers/20210222125604";

export const description = "Create content model for Carousel Item";

export const up: MigrationFunction = (migration: Migration) => {
  const carouselItem = migration
    .createContentType("carouselItem")
    .name("Carousel Item")
    .displayField("header")
    .description(
      "Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere."
    );

  carouselItem
    .createField("header")
    .name("Header")
    .type("Symbol")
    .required(true);

  carouselItem
    .createField("image")
    .name("Image")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  carouselItem.createField("body").name("Body").type("Text").required(true);

  carouselItem
    .createField("cta")
    .name("CTA")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["PROJECT", "TRAINING", "MERCHANDISE", "NONE"] }]);

  carouselItem
    .createField("audienceTiers")
    .name("Audience Tiers")
    .type("Array")
    .required(true)
    .items({ type: "Symbol", validations: [{ in: tiers }] });

  carouselItem.changeFieldControl("header", "builtin", "singleLine", {
    helpText: "The header for the item"
  });
  carouselItem.changeFieldControl("image", "builtin", "assetLinkEditor");
  carouselItem.changeFieldControl("body", "builtin", "multipleLine", {
    helpText: "The body text for the item"
  });
  carouselItem.changeFieldControl("cta", "builtin", "radio");
  carouselItem.changeFieldControl("audienceTiers", "builtin", "checkbox");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("carouselItem");
