const guaranteeCoverage = require("../../variables/guaranteeCoverage/20210222125604");
const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");
const technologies = require("../../variables/technologies/20210222125604");
const tiers = require("../../variables/tiers/20210222125604");

module.exports.description = "Create content model for Guarantee Type";

module.exports.up = (migration) => {
  const guaranteeType = migration
    .createContentType("guaranteeType")
    .name("Guarantee Type")
    .displayField("name")
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

module.exports.down = (migration) =>
  migration.deleteContentType("guaranteeType");
