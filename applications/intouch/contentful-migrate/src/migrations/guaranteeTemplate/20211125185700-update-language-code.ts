import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import previousValidations from "../../variables/languageCode/20210831102636";
import newValidations from "../../variables/languageCode/20211125185700";

export const description = "Add 'it' to valid languageCode values";

export const up: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("guaranteeTemplate")
    .editField("languageCode")
    .validations([
      {
        in: newValidations
      }
    ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration
    .editContentType("guaranteeTemplate")
    .editField("languageCode")
    .validations([
      {
        in: previousValidations
      }
    ]);
};
