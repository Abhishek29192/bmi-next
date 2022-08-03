import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for tags";

export const up: MigrationFunction = (migration: Migration) => {
  const tag = migration
    .createContentType("tag")
    .name("Tag")
    .displayField("title")
    .description("");

  tag.createField("title").name("Title").type("Symbol").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("tag");
};
