import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for FAQ Item";

export const up: MigrationFunction = (migration: Migration) => {
  const faqItem = migration
    .createContentType("faqItem")
    .name("FAQ Item")
    .displayField("title")
    .description(
      "A single FAQ Item with Question as title and answer as body."
    );

  faqItem.createField("title").name("Title").type("Symbol").required(true);

  faqItem
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  faqItem.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The HTML title of the FAQ Item"
  });
  faqItem.changeFieldControl("body", "builtin", "richTextEditor", {
    helpText: "Markdown content"
  });
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("faqItem");
