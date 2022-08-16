import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Verge Metal Flush";

export const up: MigrationFunction = (migration: Migration) => {
  const vergeMetalFlush = migration
    .createContentType("vergeMetalFlush")
    .name("Verge Metal Flush")
    .displayField("code")
    .description("");

  vergeMetalFlush
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  vergeMetalFlush
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  vergeMetalFlush
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  vergeMetalFlush.createField("image").name("Image").type("Symbol");

  vergeMetalFlush.createField("length").name("Length").type("Number");

  vergeMetalFlush.changeFieldControl("code", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl("name", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  vergeMetalFlush.changeFieldControl("image", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl("length", "builtin", "numberEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("vergeMetalFlush");
