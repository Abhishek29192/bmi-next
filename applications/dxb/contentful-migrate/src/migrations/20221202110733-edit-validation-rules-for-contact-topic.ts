import type { MigrationFunction } from "contentful-migration";

export const description = "Update validation rules for content topic type";

export const up: MigrationFunction = (migration) => {
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

export const down: MigrationFunction = (migration) => {
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
    .required(false);
};
