import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add fields to Training registration page content type";

export const up: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );

  trainingRegistrationPage
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .localized(true)
    .required(false);

  trainingRegistrationPage.moveField("breadcrumbTitle").afterField("slug");

  trainingRegistrationPage
    .createField("successTitle")
    .name("Training registration completed dialog title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("successDescription")
    .name("Training registration completed dialog description")
    .type("Text")
    .localized(true)
    .required(true);

  trainingRegistrationPage.changeFieldControl(
    "successDescription",
    "builtin",
    "multipleLine"
  );

  trainingRegistrationPage
    .createField("registrationCompletedDialogCloseButton")
    .name("Registration completed dialog close button")
    .type("Symbol")
    .localized(true)
    .required(true);
};

export const down: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );

  trainingRegistrationPage.deleteField("breadcrumbTitle");
  trainingRegistrationPage.deleteField("successTitle");
  trainingRegistrationPage.deleteField("successDescription");
  trainingRegistrationPage.deleteField(
    "registrationCompletedDialogCloseButton"
  );
};
