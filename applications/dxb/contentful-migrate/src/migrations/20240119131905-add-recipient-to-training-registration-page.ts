import type { MigrationFunction } from "contentful-migration";

export const description = "Add recipient field ";

export const up: MigrationFunction = async (migration, context) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );
  trainingRegistrationPage
    .createField("recipient")
    .name("Recipient")
    .type("Symbol")
    .required(true);

  trainingRegistrationPage.changeFieldControl(
    "recipient",
    "builtin",
    "singleLine",
    {
      helpText:
        'Enter a valid BMI email address. You can provide multiple emails using comma "," as a separator'
    }
  );

  trainingRegistrationPage
    .createField("emailSubject")
    .name("Email Subject")
    .type("Symbol")
    .required(true);

  trainingRegistrationPage.changeFieldControl(
    "emailSubject",
    "builtin",
    "singleLine",
    {
      helpText: "Enter the subject body of the email (exclude training id)"
    }
  );
};

export const down: MigrationFunction = async (migration, context) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );
  trainingRegistrationPage.deleteField("recipient");
  trainingRegistrationPage.deleteField("emailSubject");
};
