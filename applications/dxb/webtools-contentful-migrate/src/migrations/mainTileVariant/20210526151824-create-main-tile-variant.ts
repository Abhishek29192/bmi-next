import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Main Tile Variant";

export const up: MigrationFunction = (migration: Migration) => {
  const mainTileVariant = migration
    .createContentType("mainTileVariant")
    .name("Main Tile Variant")
    .displayField("code")
    .description("");

  mainTileVariant
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  mainTileVariant
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  mainTileVariant
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  mainTileVariant.createField("image").name("Image").type("Symbol");

  mainTileVariant.createField("color").name("Colour").type("Symbol");

  mainTileVariant
    .createField("minBattenGauge")
    .name("Min Batten Gauge")
    .type("Number");

  mainTileVariant
    .createField("maxBattenGauge")
    .name("Max Batten Gauge")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("eaveGauge")
    .name("Eave Gauge")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("ridgeSpacing")
    .name("Ridge Spacing")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTileVariant.createField("height").name("Height").type("Number");

  mainTileVariant.createField("width").name("Width").type("Number");

  mainTileVariant
    .createField("halfTile")
    .name("Half Tile")
    .type("Link")
    .validations([{ linkContentType: ["halfMainTile"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("ridgeOptions")
    .name("Ridge Options")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["ridgeTile"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("hip")
    .name("Hip")
    .type("Link")
    .validations([{ linkContentType: ["hipTile", "ridgeTile"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("valleyMetalFlushStart")
    .name("Valley Metal Flush Start")
    .type("Link")
    .validations([{ linkContentType: ["valleyMetalFlush"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("valleyMetalFlushEnd")
    .name("Valley Metal Flush End")
    .type("Link")
    .validations([{ linkContentType: ["valleyMetalFlush"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("valleyMetalFlushDormerStart")
    .name("Valley Metal Flush Dormer Start")
    .type("Link")
    .validations([{ linkContentType: ["valleyMetalFlush"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("vergeOptions")
    .name("Verge Options")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        { linkContentType: ["metalFlushOption", "tileVergeOption"] }
      ],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("ventilationHoodOptions")
    .name("Ventilation Hood Options")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["accessory"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("clip")
    .name("Clip")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("longScrew")
    .name("Long Screw")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("ridgeAndHipScrew")
    .name("Ridge and Hip Screw")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("screw")
    .name("Screw")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("stormBracket")
    .name("Storm Bracket")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("finishingKit")
    .name("Finishing Kit")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  mainTileVariant
    .createField("eaveAccessories")
    .name("Eave Accessories")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["accessory"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("accessories")
    .name("Accessories")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["accessory"] }],
      linkType: "Entry"
    });

  mainTileVariant
    .createField("valleyMetalFlushTop")
    .name("Valley Metal Flush Top")
    .type("Link")
    .validations([{ linkContentType: ["valleyMetalFlush"] }])
    .linkType("Entry");

  mainTileVariant.changeFieldControl("code", "builtin", "singleLine");
  mainTileVariant.changeFieldControl("name", "builtin", "singleLine");
  mainTileVariant.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  mainTileVariant.changeFieldControl("image", "builtin", "singleLine");
  mainTileVariant.changeFieldControl("color", "builtin", "singleLine");
  mainTileVariant.changeFieldControl(
    "minBattenGauge",
    "builtin",
    "numberEditor"
  );
  mainTileVariant.changeFieldControl(
    "maxBattenGauge",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl(
    "eaveGauge",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl(
    "ridgeSpacing",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl("height", "builtin", "numberEditor");
  mainTileVariant.changeFieldControl("width", "builtin", "numberEditor");
  mainTileVariant.changeFieldControl("halfTile", "builtin", "entryLinkEditor");
  mainTileVariant.changeFieldControl(
    "ridgeOptions",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl("hip", "builtin", "entryLinkEditor");
  mainTileVariant.changeFieldControl(
    "valleyMetalFlushStart",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl(
    "valleyMetalFlushEnd",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl(
    "valleyMetalFlushDormerStart",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl(
    "vergeOptions",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl(
    "ventilationHoodOptions",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl("clip", "builtin", "entryLinkEditor");
  mainTileVariant.changeFieldControl("longScrew", "builtin", "entryLinkEditor");
  mainTileVariant.changeFieldControl(
    "ridgeAndHipScrew",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl("screw", "builtin", "entryLinkEditor");
  mainTileVariant.changeFieldControl(
    "stormBracket",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl(
    "finishingKit",
    "builtin",
    "entryLinkEditor"
  );
  mainTileVariant.changeFieldControl(
    "eaveAccessories",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl(
    "accessories",
    "builtin",
    "entryLinksEditor"
  );
  mainTileVariant.changeFieldControl(
    "valleyMetalFlushTop",
    "builtin",
    "entryLinkEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("mainTileVariant");
