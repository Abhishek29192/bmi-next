import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Accessory";

export const up: MigrationFunction = (migration: Migration) => {
  const accessory = migration
    .createContentType("accessory")
    .name("Accessory")
    .displayField("code")
    .description("");

  accessory
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  accessory.createField("name").name("Name").type("Symbol").required(true);

  accessory
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  accessory.createField("image").name("Image").type("Symbol");

  accessory.createField("packSize").name("Pack Size").type("Integer");

  accessory
    .createField("category")
    .name("Category")
    .type("Symbol")
    .validations([
      { in: ["tiles", "fixings", "sealing", "ventilation", "accessories"] }
    ]);

  accessory.changeFieldControl("code", "builtin", "singleLine");
  accessory.changeFieldControl("name", "builtin", "singleLine");
  accessory.changeFieldControl("externalProductCode", "builtin", "singleLine");
  accessory.changeFieldControl("image", "builtin", "singleLine");
  accessory.changeFieldControl("packSize", "builtin", "numberEditor");
  accessory.changeFieldControl("category", "builtin", "dropdown");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("accessory");
