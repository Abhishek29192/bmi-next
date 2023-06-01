import type { MigrationFunction } from "contentful-migration";

export const description = "Make Content Topics field optional";

export const up: MigrationFunction = (migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(false);
};

export const down: MigrationFunction = (migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(true);
};
