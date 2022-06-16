import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Verge Tile";

export const up: MigrationFunction = (migration: Migration) => {
  const vergeTile = migration
    .createContentType("vergeTile")
    .name("Verge Tile")
    .displayField("code")
    .description("");

  vergeTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  vergeTile.createField("name").name("Name").type("Symbol").required(true);

  vergeTile
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  vergeTile.createField("image").name("Image").type("Symbol");

  vergeTile.createField("width").name("Width").type("Number");

  vergeTile.changeFieldControl("code", "builtin", "singleLine");
  vergeTile.changeFieldControl("name", "builtin", "singleLine");
  vergeTile.changeFieldControl("externalProductCode", "builtin", "singleLine");
  vergeTile.changeFieldControl("image", "builtin", "singleLine");
  vergeTile.changeFieldControl("width", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("vergeTile");
