import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Gutter Hook";

export const up: MigrationFunction = (migration: Migration) => {
  const gutterHook = migration
    .createContentType("gutterHook")
    .name("Gutter Hook")
    .displayField("code")
    .description("");

  gutterHook
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  gutterHook.createField("name").name("Name").type("Symbol").required(true);

  gutterHook
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  gutterHook.createField("image").name("Image").type("Symbol");

  gutterHook
    .createField("distanceBetweenHooks")
    .name("Distance between hooks")
    .type("Number");

  gutterHook.createField("color").name("Colour").type("Symbol");

  gutterHook.changeFieldControl("code", "builtin", "singleLine");
  gutterHook.changeFieldControl("name", "builtin", "singleLine");
  gutterHook.changeFieldControl("externalProductCode", "builtin", "singleLine");
  gutterHook.changeFieldControl("image", "builtin", "singleLine");
  gutterHook.changeFieldControl(
    "distanceBetweenHooks",
    "builtin",
    "numberEditor"
  );
  gutterHook.changeFieldControl("color", "builtin", "singleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("gutterHook");
