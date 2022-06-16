import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Title With Content";

export const up: MigrationFunction = (migration: Migration) => {
  const titleWithContent = migration
    .createContentType("titleWithContent")
    .name("Title With Content")
    .displayField("title")
    .description("");

  titleWithContent
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  titleWithContent
    .createField("content")
    .name("Content")
    .type("RichText")
    .required(true)
    .validations([
      {
        enabledNodeTypes: [
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "embedded-entry-block",
          "embedded-asset-block",
          "hyperlink",
          "entry-hyperlink",
          "asset-hyperlink",
          "embedded-entry-inline"
        ],
        message:
          "Only heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed"
      },
      {
        nodes: {
          "embedded-entry-block": [{ linkContentType: ["link"] }],
          "embedded-entry-inline": [{ linkContentType: ["link"] }]
        }
      }
    ]);

  titleWithContent.changeFieldControl("title", "builtin", "singleLine");
  titleWithContent.changeFieldControl("content", "builtin", "richTextEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("titleWithContent");
