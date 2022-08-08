import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model WebTool Calculator";

export const up: MigrationFunction = (migration: Migration) => {
  const webToolCalculator = migration
    .createContentType("webToolCalculator")
    .name("WebTool Calculator");

  webToolCalculator
    .createField("roofShapes")
    .name("Roof Shapes")
    .type("Array")
    .validations([{ size: { min: 1 } }])
    .required(true)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["calculatorRoofShape"] }]
    });

  webToolCalculator
    .createField("hubSpotFormId")
    .name("HubSpot Form ID")
    .type("Symbol");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("webToolCalculator");
