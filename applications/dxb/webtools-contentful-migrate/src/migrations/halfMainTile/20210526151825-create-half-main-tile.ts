import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Half Main Tile";

export const up: MigrationFunction = (migration: Migration) => {
  const halfMainTile = migration
    .createContentType("halfMainTile")
    .name("Half Main Tile")
    .displayField("code")
    .description("");

  halfMainTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  halfMainTile.createField("name").name("Name").type("Symbol").required(true);

  halfMainTile
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  halfMainTile.createField("image").name("Image").type("Symbol");

  halfMainTile.createField("width").name("Width").type("Number");

  halfMainTile.changeFieldControl("code", "builtin", "singleLine");
  halfMainTile.changeFieldControl("name", "builtin", "singleLine");
  halfMainTile.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  halfMainTile.changeFieldControl("image", "builtin", "singleLine");
  halfMainTile.changeFieldControl("width", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("halfMainTile");
