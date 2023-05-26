import type { MigrationFunction } from "contentful-migration";

export const description = "Add WebTool Calculator to the site";

export const up: MigrationFunction = (migration) => {
  const resources = migration.editContentType("site");

  resources
    .createField("pitchedRoofCalculatorConfig")
    .name("WebTool Calculator")
    .type("Link")
    .validations([{ linkContentType: ["webToolCalculator"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("site");

  resources.deleteField("pitchedRoofCalculatorConfig");
};
