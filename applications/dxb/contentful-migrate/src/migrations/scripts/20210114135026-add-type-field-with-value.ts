import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add type field to tag content type with default value";

export const up: MigrationFunction = (migration: Migration) => {
  const tag = migration.editContentType("tag");

  tag
    .createField("type")
    .name("Type")
    .type("Symbol")
    .validations([{ in: ["Page type", "Group"] }])
    .required(true);

  tag.changeFieldControl("type", "builtin", "dropdown");

  migration.transformEntries({
    contentType: "tag",
    from: ["title"],
    to: ["type"],
    transformEntryForLocale: (fromFields) => {
      // Handle draft entries that do not have a title
      if (!fromFields.title) {
        return;
      }

      // All tag entries before this migration are of type "Group"
      return { type: "Group" };
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const tag = migration.editContentType("tag");

  tag.deleteField("type");
};
