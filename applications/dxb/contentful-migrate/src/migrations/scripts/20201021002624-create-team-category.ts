import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Team Category";

export const up: MigrationFunction = (migration: Migration) => {
  const teamCategory = migration
    .createContentType("teamCategory")
    .name("Team Category")
    .displayField("title")
    .description("");

  teamCategory.createField("title").name("Title").type("Symbol").required(true);

  teamCategory
    .createField("description")
    .name("Description")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes: [
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
          "Only heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed"
      },
      { nodes: {} }
    ]);

  teamCategory
    .createField("teamMembers")
    .name("Team members")
    .type("Array")
    .omitted(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["teamMember"] }],
      linkType: "Entry"
    });

  teamCategory.changeFieldControl("title", "builtin", "singleLine");
  teamCategory.changeFieldControl("description", "builtin", "richTextEditor");
  teamCategory.changeFieldControl("teamMembers", "builtin", "entryLinksEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("teamCategory");
