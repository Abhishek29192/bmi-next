import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for iframe";

export const up: MigrationFunction = (migration: Migration) => {
  const iframe = migration
    .createContentType("iframe")
    .name("Iframe")
    .displayField("name")
    .description("");

  iframe.createField("name").name("Name").type("Symbol").required(true);
  iframe.createField("title").name("Title").type("Symbol");
  iframe.createField("url").name("URL").type("Symbol").required(true);
  iframe.createField("height").name("height").type("Symbol").required(true);

  iframe.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "This is only used for Contentful"
  });
  iframe.changeFieldControl("url", "builtin", "singleLine", {
    helpText: "This is iframe source url (src)"
  });
  iframe.changeFieldControl("height", "builtin", "singleLine", {
    helpText: "This is height of the iframe (eg. 450px)"
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("iframe");
