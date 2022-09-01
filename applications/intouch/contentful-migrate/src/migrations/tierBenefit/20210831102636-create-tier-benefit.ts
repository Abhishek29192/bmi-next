import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import tiers from "../../variables/tiers/20210222125604";

export const description = "Create content model for Tier Benefit";

export const up: MigrationFunction = (migration: Migration) => {
  const tierBenefit = migration
    .createContentType("tierBenefit")
    .name("Tier Benefit")
    .displayField("name")
    .description("A benefit received by being part of a tier");

  tierBenefit
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  tierBenefit
    .createField("tier")
    .name("Tier")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      { in: tiers, message: "Please select a tier" }
    ]);

  tierBenefit
    .createField("guaranteeValidityOffsetYears")
    .name("Guarantee Validity Offset Years")
    .type("Integer")
    .validations([{ range: { min: 0 } }]);

  tierBenefit
    .createField("description")
    .name("Description")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  tierBenefit
    .createField("shortDescription")
    .name("Short Description")
    .type("Text")
    .required(true);

  tierBenefit.changeFieldControl("name", "builtin", "singleLine");
  tierBenefit.changeFieldControl("tier", "builtin", "radio");
  tierBenefit.changeFieldControl(
    "guaranteeValidityOffsetYears",
    "builtin",
    "numberEditor",
    {
      helpText:
        "The Tier specific offset number in years used to calculate when a guarantee should expire"
    }
  );
  tierBenefit.changeFieldControl("description", "builtin", "richTextEditor");
  tierBenefit.changeFieldControl(
    "shortDescription",
    "builtin",
    "multipleLine",
    {
      helpText:
        "This will be needed in the email that is sent to people joining a new tier."
    }
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("tierBenefit");
