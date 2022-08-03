import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Underlay";

export const up: MigrationFunction = (migration: Migration) => {
  const underlay = migration
    .createContentType("underlay")
    .name("Underlay")
    .displayField("code")
    .description("");

  underlay
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  underlay.createField("name").name("Name").type("Symbol").required(true);

  underlay
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  underlay.createField("image").name("Image").type("Symbol");

  underlay
    .createField("shortDescription")
    .name("Short Description")
    .type("Symbol");

  underlay.createField("category").name("Category").type("Symbol");

  underlay.createField("length").name("Length").type("Number");

  underlay.createField("width").name("Width").type("Number");

  underlay.createField("overlap").name("Overlap").type("Number");

  underlay
    .createField("minimumSupportedPitch")
    .name("Minimum Supported Pitch")
    .type("Number");

  underlay.changeFieldControl("code", "builtin", "singleLine");
  underlay.changeFieldControl("name", "builtin", "singleLine");
  underlay.changeFieldControl("externalProductCode", "builtin", "singleLine");
  underlay.changeFieldControl("image", "builtin", "singleLine");
  underlay.changeFieldControl("shortDescription", "builtin", "singleLine");
  underlay.changeFieldControl("category", "builtin", "singleLine");
  underlay.changeFieldControl("length", "builtin", "numberEditor");
  underlay.changeFieldControl("width", "builtin", "numberEditor");
  underlay.changeFieldControl("overlap", "builtin", "numberEditor");
  underlay.changeFieldControl(
    "minimumSupportedPitch",
    "builtin",
    "numberEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("underlay");
