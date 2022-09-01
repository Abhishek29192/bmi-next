import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Table as a valid embeddable block to TitleWithContent";

export const up: MigrationFunction = (migration: Migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent.editField("content").validations([
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
        "embedded-entry-block": [{ linkContentType: ["link", "table"] }],
        "embedded-entry-inline": [{ linkContentType: ["link"] }]
      }
    }
  ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent.editField("content").validations([
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
};
