import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Hip Tile";

export const up: MigrationFunction = (migration: Migration) => {
  const hipTile = migration
    .createContentType("hipTile")
    .name("Hip Tile")
    .displayField("code")
    .description("");

  hipTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  hipTile.createField("name").name("Name").type("Symbol").required(true);

  hipTile
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  hipTile.createField("image").name("Image").type("Symbol");

  hipTile.createField("length").name("Length").type("Number");

  hipTile.changeFieldControl("code", "builtin", "singleLine");
  hipTile.changeFieldControl("name", "builtin", "singleLine");
  hipTile.changeFieldControl("externalProductCode", "builtin", "singleLine");
  hipTile.changeFieldControl("image", "builtin", "singleLine");
  hipTile.changeFieldControl("length", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("hipTile");
