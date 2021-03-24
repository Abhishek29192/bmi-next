module.exports.description =
  "Create content model for Guarantee Evidence Config";

module.exports.up = (migration) => {
  const guaranteeEvidenceConfig = migration
    .createContentType("guaranteeEvidenceConfig")
    .name("Guarantee Evidence Config")
    .displayField("name")
    .description(
      "A Guarantee to EvidenceCategory pairing to indicate that this type of Guarantee is subject to this category of evidence being satisfied"
    );

  guaranteeEvidenceConfig
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  guaranteeEvidenceConfig
    .createField("guaranteeType")
    .name("Guarantee Type")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["guaranteeType"] }])
    .linkType("Entry");

  guaranteeEvidenceConfig
    .createField("evidenceCategory")
    .name("Evidence Category")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["evidenceCategory"] }])
    .linkType("Entry");

  guaranteeEvidenceConfig.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "Display name helpful to retrieve the content entry"
  });
  guaranteeEvidenceConfig.changeFieldControl(
    "guaranteeType",
    "builtin",
    "entryLinkEditor"
  );
  guaranteeEvidenceConfig.changeFieldControl(
    "evidenceCategory",
    "builtin",
    "entryLinkEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("guaranteeEvidenceConfig");
