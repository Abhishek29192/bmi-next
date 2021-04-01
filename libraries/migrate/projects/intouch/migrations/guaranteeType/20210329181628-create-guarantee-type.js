const guaranteeCoverage = require("../../variables/guaranteeCoverage/20210222125604");
const technologies = require("../../variables/technologies/20210222125604");
const tiers = require("../../variables/tiers/20210222125604");
const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");

module.exports.description = "Create content model for Guarantee Type";

module.exports.up = (migration) => {
  const guaranteeType = migration
    .createContentType("guaranteeType")
    .name("Guarantee Type")
    .displayField("displayName")
    .description("A type of guarantee");

  guaranteeType
    .createField("displayName")
    .name("Display Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

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
    .createField("maximumValidity")
    .name("MaximumValidity")
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
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["evidenceCategory"] }],
      linkType: "Entry"
    });

  guaranteeType
    .createField("guaranteeTemplate")
    .name("Guarantee Template")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["guaranteeTemplate"] }])
    .linkType("Entry");

  guaranteeType.changeFieldControl("displayName", "builtin", "singleLine");
  guaranteeType.changeFieldControl("technology", "builtin", "dropdown");
  guaranteeType.changeFieldControl("coverage", "builtin", "dropdown");
  guaranteeType.changeFieldControl("name", "builtin", "singleLine");
  guaranteeType.changeFieldControl("signature", "builtin", "assetLinkEditor");
  guaranteeType.changeFieldControl(
    "maximumValidity",
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
    "entryLinksEditor"
  );
  guaranteeType.changeFieldControl(
    "guaranteeTemplate",
    "builtin",
    "entryCardEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("guaranteeType");
