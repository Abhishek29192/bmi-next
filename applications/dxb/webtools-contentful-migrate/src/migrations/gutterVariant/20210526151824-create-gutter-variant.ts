import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Gutter Variant";

export const up: MigrationFunction = (migration: Migration) => {
  const gutterVariant = migration
    .createContentType("gutterVariant")
    .name("Gutter Variant")
    .displayField("code")
    .description("");

  gutterVariant
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  gutterVariant.createField("name").name("Name").type("Symbol").required(true);

  gutterVariant
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  gutterVariant.createField("image").name("Image").type("Symbol");

  gutterVariant.createField("length").name("Length").type("Number");

  gutterVariant
    .createField("downPipe")
    .name("Down Pipe")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  gutterVariant
    .createField("downPipeConnector")
    .name("Down Pipe Connector")
    .type("Link")
    .validations([{ linkContentType: ["accessory"] }])
    .linkType("Entry");

  gutterVariant.changeFieldControl("code", "builtin", "singleLine");
  gutterVariant.changeFieldControl("name", "builtin", "singleLine");
  gutterVariant.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  gutterVariant.changeFieldControl("image", "builtin", "singleLine");
  gutterVariant.changeFieldControl("length", "builtin", "numberEditor");
  gutterVariant.changeFieldControl("downPipe", "builtin", "entryLinkEditor");
  gutterVariant.changeFieldControl(
    "downPipeConnector",
    "builtin",
    "entryLinkEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("gutterVariant");
