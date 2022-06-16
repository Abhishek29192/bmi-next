import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create Table content type";

export const up: MigrationFunction = (migration: Migration) => {
  const table = migration
    .createContentType("table")
    .name("Table")
    .displayField("title");

  table.createField("title").name("Title").type("Text").required(true);

  table.createField("data").name("Data").type("Object");

  // TODO: Figure out extension widgetIDs
  // https://www.contentful.com/developers/docs/references/content-management-api/#/reference/ui-extensions/extensions-collection
  // https://www.contentful.com/developers/docs/concepts/editor-interfaces/#custom-widgets
  table.changeFieldControl("data", "extension", "7zdNJV7cj8MpVwN5ontGk2");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("table");
};
