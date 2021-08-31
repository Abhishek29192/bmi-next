const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");
const guaranteeCoverage = require("../../variables/guaranteeCoverage/20210222125604");
const technologies = require("../../variables/technologies/20210222125604");

module.exports.description = "Create content model for Guarantee Template";

module.exports.up = (migration) => {
  const guaranteeTemplate = migration
    .createContentType("guaranteeTemplate")
    .name("Guarantee Template")
    .displayField("displayName")
    .description("A template for a type of Guarantee");

  guaranteeTemplate
    .createField("displayName")
    .name("Display Name")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("technology")
    .name("Technology")
    .type("Symbol")
    .required(true)
    .validations([{ in: technologies }]);

  guaranteeTemplate
    .createField("coverage")
    .name("Coverage")
    .type("Symbol")
    .required(true)
    .validations([{ in: guaranteeCoverage }]);

  guaranteeTemplate
    .createField("languageCode")
    .name("Language Code")
    .type("Symbol")
    .required(true)
    .validations([
      {
        in: [
          "da",
          "no",
          "en",
          "sv",
          "pt",
          "de",
          "nl",
          "sk",
          "fr",
          "pl",
          "es",
          "fi"
        ]
      }
    ]);

  guaranteeTemplate
    .createField("languageDescriptor")
    .name("Language Descriptor")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("approvalMessage")
    .name("Approval Message")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["messageTemplate"] }])
    .linkType("Entry");

  guaranteeTemplate
    .createField("rejectionMessage")
    .name("Rejection Message")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["messageTemplate"] }])
    .linkType("Entry");

  guaranteeTemplate
    .createField("logo")
    .name("Logo")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  guaranteeTemplate
    .createField("titleLine1")
    .name("Title Line 1")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("titleLine2")
    .name("Title Line 2")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("signatory")
    .name("Signatory")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingGuarantee")
    .name("Heading Guarantee")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingScope")
    .name("Heading Scope")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingProducts")
    .name("Heading Products")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingBeneficiary")
    .name("Heading Beneficiary")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingBuildingOwnerName")
    .name("Heading Building Owner Name")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingBuildingAddress")
    .name("Heading Building Address")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingRoofArea")
    .name("Heading Roof Area")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingRoofType")
    .name("Heading Roof Type")
    .type("Symbol");

  guaranteeTemplate
    .createField("roofType")
    .name("Roof Type")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingContractor")
    .name("Heading Contractor")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingContractorName")
    .name("Heading Contractor Name")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingContractorId")
    .name("Heading Contractor Id")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingStartDate")
    .name("Heading Start Date")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingGuaranteeId")
    .name("Heading Guarantee Id")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("headingValidity")
    .name("Heading Validity")
    .type("Symbol");

  guaranteeTemplate
    .createField("headingExpiry")
    .name("Heading Expiry")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("footer")
    .name("Footer")
    .type("Text")
    .required(true);

  guaranteeTemplate
    .createField("maintenanceTemplate")
    .name("Maintenance Template")
    .type("Link")
    .validations([
      { linkMimetypeGroup: ["pdfdocument"] },
      { assetFileSize: { max: MAX_FILE_SIZES.PDF } }
    ])
    .linkType("Asset");

  guaranteeTemplate
    .createField("guaranteeScope")
    .name("Guarantee Scope")
    .type("Symbol")
    .required(true);

  guaranteeTemplate
    .createField("terms")
    .name("Terms")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["pdfdocument"] },
      { assetFileSize: { max: MAX_FILE_SIZES.PDF } }
    ])
    .linkType("Asset");

  guaranteeTemplate
    .createField("mailBody")
    .name("Mail Body")
    .type("Text")
    .required(true);

  guaranteeTemplate
    .createField("filenamePrefix")
    .name("Filename Prefix")
    .type("Symbol")
    .required(true);

  guaranteeTemplate.changeFieldControl("displayName", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl("technology", "builtin", "dropdown");
  guaranteeTemplate.changeFieldControl("coverage", "builtin", "dropdown");
  guaranteeTemplate.changeFieldControl("languageCode", "builtin", "dropdown", {
    helpText:
      "Language code for the template. It is used to reference a template in the database by language. Combined with technology & coverage, it will be the key instead of the Contentful ID."
  });
  guaranteeTemplate.changeFieldControl(
    "languageDescriptor",
    "builtin",
    "singleLine",
    {
      helpText:
        "The text which is presented to the Company Admins to select templates by language on Intouch"
    }
  );
  guaranteeTemplate.changeFieldControl(
    "approvalMessage",
    "builtin",
    "entryLinkEditor"
  );
  guaranteeTemplate.changeFieldControl(
    "rejectionMessage",
    "builtin",
    "entryLinkEditor"
  );
  guaranteeTemplate.changeFieldControl("logo", "builtin", "assetLinkEditor");
  guaranteeTemplate.changeFieldControl("titleLine1", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl("titleLine2", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl("signatory", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl(
    "headingGuarantee",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl("headingScope", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl(
    "headingProducts",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingBeneficiary",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingBuildingOwnerName",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingBuildingAddress",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingRoofArea",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingRoofType",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl("roofType", "builtin", "singleLine");
  guaranteeTemplate.changeFieldControl(
    "headingContractor",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingContractorName",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingContractorId",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingStartDate",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingGuaranteeId",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingValidity",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "headingExpiry",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl("footer", "builtin", "multipleLine");
  guaranteeTemplate.changeFieldControl(
    "maintenanceTemplate",
    "builtin",
    "assetLinkEditor"
  );
  guaranteeTemplate.changeFieldControl(
    "guaranteeScope",
    "builtin",
    "singleLine"
  );
  guaranteeTemplate.changeFieldControl("terms", "builtin", "assetLinkEditor");
  guaranteeTemplate.changeFieldControl("mailBody", "builtin", "multipleLine");
  guaranteeTemplate.changeFieldControl(
    "filenamePrefix",
    "builtin",
    "singleLine"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("guaranteeTemplate");
