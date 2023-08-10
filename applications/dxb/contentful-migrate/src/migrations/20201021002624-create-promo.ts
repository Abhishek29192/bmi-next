import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Promo";

export const up: MigrationFunction = (migration) => {
  const promo = migration
    .createContentType("promo")
    .name("Promo")
    .displayField("title")
    .description("");

  promo.createField("title").name("Title").type("Symbol").required(true);

  promo
    .createField("brandLogo")
    .name("Brand Logo")
    .type("Symbol")
    .validations([
      { in: ["Icopal", "Zanda", "Monier", "Monarplan", "AeroDek"] }
    ]);

  promo
    .createField("image")
    .name("Image")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  promo.createField("subtitle").name("Subtitle").type("Symbol");

  promo
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  promo.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This text will be displayed with an underline on the Hero"
  });
  promo.changeFieldControl("brandLogo", "builtin", "dropdown", {
    helpText: "Show a brand logo for this promo entry"
  });
  promo.changeFieldControl("image", "builtin", "assetLinkEditor");
  promo.changeFieldControl("subtitle", "builtin", "singleLine");
  promo.changeFieldControl("cta", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration) =>
  migration.deleteContentType("promo");
