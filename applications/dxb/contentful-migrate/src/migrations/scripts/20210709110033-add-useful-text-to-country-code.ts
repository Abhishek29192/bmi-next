import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add useful text to Country Code";

export const up: MigrationFunction = (migration: Migration) => {
  const contentTopic = migration.editContentType("site");

  contentTopic.changeFieldControl("countryCode", "builtin", "singleLine", {
    helpText:
      "The Country Code is used to define the root country for a market, Changing it will make the entire market’s website unreachable. DO NOT PROCEED unless the change has been authorised."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const contentTopic = migration.editContentType("site");

  contentTopic.changeFieldControl("countryCode", "builtin", "singleLine", {
    helpText: ""
  });
};
