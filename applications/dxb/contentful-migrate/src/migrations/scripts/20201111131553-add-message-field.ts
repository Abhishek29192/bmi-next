import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add message field";

export const up: MigrationFunction = (migration: Migration) => {
  const shareWidgetSection = migration.editContentType("shareWidgetSection");

  shareWidgetSection.createField("message").name("Message").type("Symbol");
  shareWidgetSection.moveField("message").afterField("title");
};

export const down: MigrationFunction = (migration: Migration) => {
  const shareWidgetSection = migration.editContentType("shareWidgetSection");

  shareWidgetSection.deleteField("message");
};
