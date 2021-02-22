"use strict";

module.exports.description = "Create InputBanner Content Type";

module.exports.up = (migration) => {
  const inputBanner = migration
    .createContentType("inputBanner")
    .name("Input Banner")
    .displayField("title");

  inputBanner.createField("title").name("Title").type("Symbol").required(true);

  inputBanner
    .createField("description")
    .name("Description")
    .type("Text")
    .required(true);

  inputBanner
    .createField("inputLabel")
    .name("Input Label")
    .type("Symbol")
    .required(true);

  inputBanner
    .createField("submitButtonLabel")
    .name("Submit Label")
    .type("Symbol")
    .required(true);

  inputBanner
    .createField("additionalInputs")
    .name("Additional Inputs")
    .type("Object");

  inputBanner
    .createField("confirmationButtonLabel")
    .name("Confirmation Button Label")
    .type("Symbol");

  inputBanner
    .createField("thankYouMessage")
    .name("Thank you message")
    .type("Symbol");

  inputBanner.changeFieldControl("title", "builtin", "singleLine");
  inputBanner.changeFieldControl("description", "builtin", "singleLine");
  inputBanner.changeFieldControl("inputLabel", "builtin", "singleLine");
  inputBanner.changeFieldControl("submitButtonLabel", "builtin", "singleLine");
  inputBanner.changeFieldControl(
    "additionalInputs",
    "builtin",
    "3cvPE2OV7Msa8Poo0kQRVi"
  );
  inputBanner.changeFieldControl(
    "confirmationButtonLabel",
    "builtin",
    "singleLine"
  );
  inputBanner.changeFieldControl("thankYouMessage", "builtin", "singleLine");
};

module.exports.down = (migration) => {
  migration.deleteContentType("inputBanner");
};
