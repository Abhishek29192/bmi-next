import type { MigrationFunction } from "contentful-migration";

export const description =
  "Edit field types of some training registration page fields";

export const up: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );
  trainingRegistrationPage.deleteField("consentText");
  trainingRegistrationPage.deleteField("competentChamberLabel");
  trainingRegistrationPage.deleteField("termsOfUse");

  trainingRegistrationPage
    .createField("consentText")
    .name("Consent text")
    .type("Text")
    .localized(true)
    .required(true);
  trainingRegistrationPage.changeFieldControl(
    "consentText",
    "builtin",
    "multipleLine"
  );

  trainingRegistrationPage
    .createField("competentChamberLabel")
    .name("Competent Chamber Label")
    .type("Text")
    .localized(true)
    .required(true);
  trainingRegistrationPage.changeFieldControl(
    "competentChamberLabel",
    "builtin",
    "multipleLine"
  );

  trainingRegistrationPage
    .createField("termsOfUse")
    .name("Terms Of Use")
    .type("Text")
    .localized(true)
    .required(true);
  trainingRegistrationPage.changeFieldControl(
    "termsOfUse",
    "builtin",
    "multipleLine"
  );
};

export const down: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );
  trainingRegistrationPage.deleteField("consentText");
  trainingRegistrationPage.deleteField("competentChamberLabel");
  trainingRegistrationPage.deleteField("termsOfUse");

  trainingRegistrationPage
    .createField("consentText")
    .name("Consent text")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("competentChamberLabel")
    .name("Competent Chamber Label")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("termsOfUse")
    .name("Terms Of Use")
    .type("Symbol")
    .localized(true)
    .required(true);
};
