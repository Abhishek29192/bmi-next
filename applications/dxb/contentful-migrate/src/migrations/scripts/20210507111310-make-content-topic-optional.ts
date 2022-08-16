import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Make Content Topics field optional";

export const up: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(true);
};
