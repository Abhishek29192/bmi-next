import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Navigation Item";

export const up: MigrationFunction = (migration: Migration) => {
  const navigationItem = migration
    .createContentType("navigationItem")
    .name("Navigation Item")
    .displayField("title")
    .description("");

  navigationItem
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  navigationItem
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Separator", "Heading"] }]);

  navigationItem.createField("value").name("Value").type("Symbol");

  navigationItem.changeFieldControl("title", "builtin", "singleLine");
  navigationItem.changeFieldControl("type", "builtin", "dropdown");
  navigationItem.changeFieldControl("value", "builtin", "singleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("navigationItem");
