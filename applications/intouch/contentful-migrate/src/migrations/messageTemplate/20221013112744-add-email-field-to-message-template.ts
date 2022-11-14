import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add new events to Message Template";

export const up: MigrationFunction = (migration: Migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate
    .createField("emailRecipient")
    .name("Market Admin Email Recipient")
    .type("Symbol");

  messageTemplate.moveField("emailRecipient").afterField("format");

  messageTemplate.changeFieldControl(
    "emailRecipient",
    "builtin",
    "singleLine",
    {
      helpText:
        "seperate with (,) for multiple recipient. E.g: a@bmigroup.com, b@bmigroup.com"
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate.deleteField("emailRecipient");
};
