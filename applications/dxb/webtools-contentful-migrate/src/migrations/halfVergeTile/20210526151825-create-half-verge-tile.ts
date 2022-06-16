import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Half Verge Tile";

export const up: MigrationFunction = (migration: Migration) => {
  const halfVergeTile = migration
    .createContentType("halfVergeTile")
    .name("Half Verge Tile")
    .displayField("code")
    .description("");

  halfVergeTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  halfVergeTile.createField("name").name("Name").type("Symbol").required(true);

  halfVergeTile
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  halfVergeTile.createField("image").name("Image").type("Symbol");

  halfVergeTile.createField("width").name("Width").type("Number");

  halfVergeTile.changeFieldControl("code", "builtin", "singleLine");
  halfVergeTile.changeFieldControl("name", "builtin", "singleLine");
  halfVergeTile.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  halfVergeTile.changeFieldControl("image", "builtin", "singleLine");
  halfVergeTile.changeFieldControl("width", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("halfVergeTile");
