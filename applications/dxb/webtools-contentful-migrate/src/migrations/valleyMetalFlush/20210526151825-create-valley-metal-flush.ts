import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Valley Metal Flush";

export const up: MigrationFunction = (migration: Migration) => {
  const valleyMetalFlush = migration
    .createContentType("valleyMetalFlush")
    .name("Valley Metal Flush")
    .displayField("code")
    .description("");

  valleyMetalFlush
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  valleyMetalFlush
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  valleyMetalFlush
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  valleyMetalFlush.createField("image").name("Image").type("Symbol");

  valleyMetalFlush.createField("length").name("Length").type("Number");

  valleyMetalFlush.changeFieldControl("code", "builtin", "singleLine");
  valleyMetalFlush.changeFieldControl("name", "builtin", "singleLine");
  valleyMetalFlush.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  valleyMetalFlush.changeFieldControl("image", "builtin", "singleLine");
  valleyMetalFlush.changeFieldControl("length", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("valleyMetalFlush");
