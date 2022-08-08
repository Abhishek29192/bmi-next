import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Calculator Rood Shape";

export const up: MigrationFunction = (migration: Migration) => {
  const calculatorRoofShape = migration
    .createContentType("calculatorRoofShape")
    .name("Calculator Roof Shape")
    .displayField("name")
    .description("");

  calculatorRoofShape
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  calculatorRoofShape
    .createField("roofShapeId")
    .name("Roof Shape Id")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  calculatorRoofShape
    .createField("media")
    .name("Image")
    .type("Link")
    .required(true)
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("calculatorRoofShape");
