import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add sort order";

export const up: MigrationFunction = (migration: Migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .createField("sortOrder")
    .name("Sort order")
    .type("Symbol")
    .validations([
      {
        in: [
          "Default (Contentful)",
          "Date (Newest first)",
          "Date (Oldest first)"
        ]
      }
    ]);

  cardCollectionSection.changeFieldControl("sortOrder", "builtin", "dropdown", {
    helpText:
      "Date sorting will only apply to card entries with `date` fields, e.g. Simple page."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("cardCollectionSection").deleteField("sortOrder");
};
