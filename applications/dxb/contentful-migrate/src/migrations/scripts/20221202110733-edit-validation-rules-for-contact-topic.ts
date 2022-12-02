import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update validation rules for content topic type";

export const up: MigrationFunction = (migration: Migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic
    .editField("icon")
    .type("Symbol")
    .validations([
      {
        in: [
          "build",
          "shoppingCart",
          "localShipping",
          "reportProblem",
          "info",
          "findReplace",
          "verifiedUser",
          "help"
        ]
      }
    ])
    .required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic
    .editField("icon")
    .type("Symbol")
    .validations([
      { regexp: { pattern: "" } },
      {
        in: [
          "build",
          "shoppingCart",
          "localShipping",
          "reportProblem",
          "info",
          "findReplace",
          "verifiedUser",
          "help"
        ]
      }
    ])
    .required(false);
};
