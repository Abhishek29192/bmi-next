import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import guaranteeCoverage from "../../variables/guaranteeCoverage/20210222125604";
import { MAX_FILE_SIZES } from "../../variables/mediaSizes/20210222125604";
import technologies from "../../variables/technologies/20210222125604";
import tiers from "../../variables/tiers/20210222125604";

export const description = "Create content model for Guarantee Type";

export const up: MigrationFunction = (migration: Migration) => {
  const guaranteeType = migration
    .createContentType("guaranteeType")
    .name("Guarantee Type")
    .displayField("displayName")
    .description("A type of guarantee");

  guaranteeType
    .createField("displayName")
    .name("Display Name")
    .type("Symbol")
    .required(true);

  guaranteeType
    .createField("technology")
    .name("Technology")
    .type("Symbol")
    .required(true)
    .validations([{ in: technologies }]);

  guaranteeType
    .createField("coverage")
    .name("Coverage")
    .type("Symbol")
    .required(true)
    .validations([{ in: guaranteeCoverage }]);

  guaranteeType
    .createField("guaranteeReferenceCode")
    .name("Guarantee Reference Code")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        in: [
          "FLAT_PRODUCT",
          "FLAT_SYSTEM",
          "FLAT_SOLUTION",
          "PITCHED_PRODUCT",
          "PITCHED_SYSTEM",
          "PITCHED_SOLUTION"
        ]
      }
    ]);

  guaranteeType
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  guaranteeType
    .createField("signature")
    .name("Signature")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  guaranteeType
    .createField("maximumValidityYears")
    .name("Maximum Validity Years")
    .type("Integer")
    .required(true)
    .validations([{ range: { min: 1 } }]);

  guaranteeType
    .createField("tiersAvailable")
    .name("TiersAvailable")
    .type("Array")
    .required(true)
    .items({ type: "Symbol", validations: [{ in: tiers }] });

  guaranteeType
    .createField("ranking")
    .name("Ranking")
    .type("Integer")
    .required(true)
    .validations([{ unique: true }, { range: { min: 1 } }]);

  guaranteeType
    .createField("evidenceCategories")
    .name("Evidence Categories")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["evidenceCategory"] }],
      linkType: "Entry"
    });

  guaranteeType
    .createField("guaranteeTemplates")
    .name("Guarantee Templates")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["guaranteeTemplate"] }],
      linkType: "Entry"
    });

  guaranteeType.changeFieldControl("displayName", "builtin", "singleLine");
  guaranteeType.changeFieldControl("technology", "builtin", "dropdown");
  guaranteeType.changeFieldControl("coverage", "builtin", "dropdown");
  guaranteeType.changeFieldControl(
    "guaranteeReferenceCode",
    "builtin",
    "dropdown",
    {
      helpText:
        "This field ensures the uniqueness of the entry. Guarantees will reference this field instead of the Contentful ID."
    }
  );
  guaranteeType.changeFieldControl("name", "builtin", "singleLine");
  guaranteeType.changeFieldControl("signature", "builtin", "assetLinkEditor");
  guaranteeType.changeFieldControl(
    "maximumValidityYears",
    "builtin",
    "numberEditor"
  );
  guaranteeType.changeFieldControl("tiersAvailable", "builtin", "checkbox");
  guaranteeType.changeFieldControl("ranking", "builtin", "numberEditor", {
    helpText:
      "A whole number indicating the prestige of this GuaranteeType so that it can be ordered amongst other Guarantees. 1 being the best."
  });
  guaranteeType.changeFieldControl(
    "evidenceCategories",
    "builtin",
    "entryLinksEditor",
    {
      helpText: "List of Evidence Cateogries",
      bulkEditing: false,
      showLinkEntityAction: true,
      showCreateEntityAction: true
    }
  );
  guaranteeType.changeFieldControl(
    "guaranteeTemplates",
    "builtin",
    "entryCardsEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("guaranteeType");
