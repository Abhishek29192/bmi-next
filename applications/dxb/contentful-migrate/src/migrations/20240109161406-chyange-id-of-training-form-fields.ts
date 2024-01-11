import type { MigrationFunction } from "contentful-migration";

export const description = "Change ID of training registration form fields";

export const up: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );

  trainingRegistrationPage.editField("extraParticpantTitle", {
    newId: "extraParticpantTitle",
    type: "Symbol"
  });

  trainingRegistrationPage.editField("extraParticpantSubtitle", {
    newId: "extraParticipantSubtitle",
    type: "Symbol"
  });
};

export const down: MigrationFunction = async (migration) => {
  const trainingRegistrationPage = migration.editContentType(
    "trainingRegistrationPage"
  );

  trainingRegistrationPage.editField("extraParticipantTitle", {
    newId: "extraParticpantTitle",
    type: "Symbol"
  });

  trainingRegistrationPage.editField("extraParticipantSubtitle", {
    newId: "extraParticpantSubtitle",
    type: "Symbol"
  });
};
