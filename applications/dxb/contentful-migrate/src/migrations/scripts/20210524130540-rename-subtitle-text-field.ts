import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "rename and disable subtitle field";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitle", "subtitleShortText");
  // TODO: delete this disabled and un-used field when markets are happy with it
  // preferably after go-live ( new migration script on this content type)
  page.editField("subtitleShortText").disabled(true).omitted(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitleShortText", "subtitle");
  page.editField("subtitle").disabled(false).omitted(false);
  page.moveField("subtitle").afterField("brandLogo");
};
