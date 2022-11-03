import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Update email validation for emailRecipient to Message Template";

export const up: MigrationFunction = (migration: Migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate.editField("emailRecipient").validations([
    {
      regexp: {
        pattern:
          "^([a-zA-Z0-9_\\-\\.\\+\\/]+)@([a-zA-Z0-9\\-]+\\.)+([a-zA-Z0-9\\-\\.]+)+([,\\s]*([a-zA-Z0-9_\\-\\.\\+\\/)@([a-zA-Z0-9\\-]+\\.)+([a-zA-Z0-9\\-\\.]+))*$",
        flags: "g"
      }
    }
  ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const messageTemplate = migration.editContentType("messageTemplate");

  messageTemplate.editField("emailRecipient").validations([
    {
      regexp: {
        pattern:
          "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9\\-]+\\.)+([a-zA-Z0-9\\-\\.]+)+([,\\s]*([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9\\-]+\\.)+([a-zA-Z0-9\\-\\.]+))*$",
        flags: "g"
      }
    }
  ]);
};
