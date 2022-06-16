import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create InputBanner Content Type";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("inputBanner");
};
