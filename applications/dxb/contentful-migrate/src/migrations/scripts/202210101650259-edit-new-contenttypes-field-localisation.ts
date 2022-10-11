import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "localise new content type fields";

export const up: MigrationFunction = async (migration: Migration) => {
  const brand = migration.editContentType("brand");
  brand.editField("title").localized(true);
  brand.editField("brandLogo").localized(true);
  brand.editField("subtitle").localized(true);
  brand.editField("path").localized(true);

  const homePage = migration.editContentType("homePage");
  homePage.editField("spaBrands").localized(true);

  const calculatorRoofShape = migration.editContentType("calculatorRoofShape");
  calculatorRoofShape.editField("name").localized(true);
  calculatorRoofShape.editField("roofShapeId").localized(true);
  calculatorRoofShape.editField("media").localized(true);

  const webToolCalculator = migration.editContentType("webToolCalculator");
  webToolCalculator.editField("roofShapes").localized(true);
  webToolCalculator.editField("hubSpotFormId").localized(true);

  const site = migration.editContentType("site");
  site.editField("pitchedRoofCalculatorConfig").localized(true);
  site.editField("visualiserHouseTypes").localized(true);

  const visualiserHouseType = migration.editContentType("visualiserHouseType");
  visualiserHouseType.editField("name").localized(true);
  visualiserHouseType.editField("previewImage").localized(true);
  visualiserHouseType.editField("houseModel").localized(true);

  const calculator = migration.editContentType("webToolCalculator");
  calculator.editField("name").localized(true);
  calculator.editField("needHelpSection").localized(true);

  const page = migration.editContentType("document");
  page.editField("noIndex").localized(true);

  const roofer = migration.editContentType("roofer");
  roofer.editField("websiteLinkAsLabel").localized(true);
};

export const down: MigrationFunction = async (migration: Migration) => {
  const brand = migration.editContentType("brand");
  brand.editField("title").localized(false);
  brand.editField("brandLogo").localized(false);
  brand.editField("subtitle").localized(false);
  brand.editField("path").localized(false);

  const homePage = migration.editContentType("homePage");
  homePage.editField("spaBrands").localized(false);

  const calculatorRoofShape = migration.editContentType("calculatorRoofShape");
  calculatorRoofShape.editField("name").localized(false);
  calculatorRoofShape.editField("roofShapeId").localized(false);
  calculatorRoofShape.editField("media").localized(false);

  const webToolCalculator = migration.editContentType("webToolCalculator");
  webToolCalculator.editField("roofShapes").localized(false);
  webToolCalculator.editField("hubSpotFormId").localized(false);

  const site = migration.editContentType("site");
  site.editField("pitchedRoofCalculatorConfig").localized(false);
  site.editField("visualiserHouseTypes").localized(false);

  const visualiserHouseType = migration.editContentType("visualiserHouseType");
  visualiserHouseType.editField("name").localized(false);
  visualiserHouseType.editField("previewImage").localized(false);
  visualiserHouseType.editField("houseModel").localized(false);

  const calculator = migration.editContentType("webToolCalculator");
  calculator.editField("name").localized(false);
  calculator.editField("needHelpSection").localized(false);

  const page = migration.editContentType("document");
  page.editField("noIndex").localized(false);

  const roofer = migration.editContentType("roofer");
  roofer.editField("websiteLinkAsLabel").localized(false);
};
