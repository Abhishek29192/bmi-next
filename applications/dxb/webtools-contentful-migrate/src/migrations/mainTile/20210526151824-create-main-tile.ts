import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Main Tile";

export const up: MigrationFunction = (migration: Migration) => {
  const mainTile = migration
    .createContentType("mainTile")
    .name("Main Tile")
    .displayField("code")
    .description("");

  mainTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  mainTile.createField("name").name("Name").type("Symbol").required(true);

  mainTile
    .createField("minBattenGauge")
    .name("Min Batten Gauge")
    .type("Number");

  mainTile
    .createField("maxBattenGauge")
    .name("Max Batten Gauge")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTile
    .createField("eaveGauge")
    .name("Eave Gauge")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTile
    .createField("ridgeSpacing")
    .name("Ridge Spacing")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["rangeValue"] }],
      linkType: "Entry"
    });

  mainTile.createField("height").name("Height").type("Number");

  mainTile.createField("width").name("Width").type("Number");

  mainTile.createField("brokenBond").name("Broken Bond").type("Boolean");

  mainTile
    .createField("accessories")
    .name("Accessories")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["accessory"] }],
      linkType: "Entry"
    });

  mainTile
    .createField("variants")
    .name("Variants")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["mainTileVariant"] }],
      linkType: "Entry"
    });

  mainTile
    .createField("category")
    .name("Category")
    .type("Symbol")
    .validations([{ in: ["concrete", "metal", "clay"] }]);

  mainTile.changeFieldControl("code", "builtin", "singleLine");
  mainTile.changeFieldControl("name", "builtin", "singleLine");
  mainTile.changeFieldControl("minBattenGauge", "builtin", "numberEditor");
  mainTile.changeFieldControl("maxBattenGauge", "builtin", "entryLinksEditor");
  mainTile.changeFieldControl("eaveGauge", "builtin", "entryLinksEditor");
  mainTile.changeFieldControl("ridgeSpacing", "builtin", "entryLinksEditor");
  mainTile.changeFieldControl("height", "builtin", "numberEditor");
  mainTile.changeFieldControl("width", "builtin", "numberEditor");
  mainTile.changeFieldControl("brokenBond", "builtin", "boolean");
  mainTile.changeFieldControl("accessories", "builtin", "entryLinksEditor");
  mainTile.changeFieldControl("variants", "builtin", "entryLinksEditor");
  mainTile.changeFieldControl("category", "builtin", "dropdown");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("mainTile");
