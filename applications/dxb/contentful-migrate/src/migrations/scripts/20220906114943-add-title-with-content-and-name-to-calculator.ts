import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description =
  "Add titleWithContent and name to Pitched Roof Calculator";

export const up: MigrationFunction = (migration: Migration) => {
  const calculator = migration.editContentType("webToolCalculator");

  calculator.createField("name").name("Name").type("Symbol").omitted(true);

  calculator.moveField("name").toTheTop();

  calculator
    .displayField("name")
    .changeFieldControl("name", "builtin", "singleLine", {
      helpText: internalName
    });

  calculator
    .createField("needHelpSection")
    .name("Need help section")
    .required(true)
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["titleWithContent"] }]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const calculator = migration.editContentType("webToolCalculator");

  //Set hubSpotFormId as displayField because webToolCalculator doesn't have another string field
  calculator.displayField("hubSpotFormId");
  calculator.deleteField("name");
  calculator.deleteField("needHelpSection");
};
