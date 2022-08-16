import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Message Template";

export const up: MigrationFunction = (migration: Migration) => {
  const messageTemplate = migration
    .createContentType("messageTemplate")
    .name("Message Template")
    .displayField("event")
    .description("A template for email and/or notifications");

  messageTemplate
    .createField("event")
    .name("Event")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        in: [
          "MEMBER_INVITED",
          "NEWUSER_INVITED",
          "PROFILE_REMINDER",
          "ROLE_ASSIGNED",
          "ACCOUNT_REGISTERED",
          "ACCOUNT_ACTIVATED",
          "CERTIFICATION_EXPIRED",
          "TIER_ASSIGNED",
          "REQUEST_AUTOMATICALLY_APPROVED",
          "REQUEST_APPROVED",
          "REQUEST_REJECTED",
          "TEAM_JOINED",
          "COMPANY_MEMBER_REMOVED",
          "COMPANY_REGISTERED",
          "NOTE_ADDED"
        ]
      }
    ]);

  messageTemplate
    .createField("format")
    .name("Format")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [{ in: ["EMAIL", "NOTIFICATION"] }]
    });

  messageTemplate
    .createField("subject")
    .name("Subject")
    .type("Symbol")
    .required(true);

  messageTemplate
    .createField("notificationBody")
    .name("Notification Body")
    .type("Symbol");

  messageTemplate.createField("emailBody").name("Email Body").type("Text");

  messageTemplate.changeFieldControl("event", "builtin", "dropdown");
  messageTemplate.changeFieldControl("format", "builtin", "checkbox");
  messageTemplate.changeFieldControl("subject", "builtin", "singleLine");
  messageTemplate.changeFieldControl(
    "notificationBody",
    "builtin",
    "singleLine"
  );
  messageTemplate.changeFieldControl("emailBody", "builtin", "multipleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("messageTemplate");
