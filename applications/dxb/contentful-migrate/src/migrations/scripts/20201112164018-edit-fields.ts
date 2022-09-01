import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Edit Lead Block Section fields";

export const up: MigrationFunction = (migration: Migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection
    .editField("text")
    .name("Description")
    .validations([
      {
        enabledNodeTypes: [
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "hyperlink",
          "entry-hyperlink",
          "asset-hyperlink"
        ],
        message:
          "Only ordered list, unordered list, horizontal rule, quote, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed"
      }
    ]);

  leadBlockSection
    .createField("postItCard")
    .name("Post it Card")
    .type("RichText")
    .validations([
      {
        enabledNodeTypes: [
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
          "Only heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed"
      },
      {
        nodes: {
          "embedded-entry-block": [{ linkContentType: ["link"] }],
          "embedded-entry-inline": [{ linkContentType: ["link"] }]
        }
      }
    ]);

  leadBlockSection.changeFieldControl(
    "postItCard",
    "builtin",
    "richTextEditor",
    {
      helpText:
        "A table of content will be rendered in case this field is empty."
    }
  );

  leadBlockSection.deleteField("cardTheme");
  leadBlockSection.deleteField("cardSections");
};

export const down: MigrationFunction = (migration: Migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection
    .editField("text")
    .name("Text")
    .type("RichText")
    .required(true)
    .validations([
      { enabledMarks: ["bold"], message: "Only bold marks are allowed" },
      {
        enabledNodeTypes: ["heading-2"],
        message: "Only heading 2 nodes are allowed"
      }
    ]);

  leadBlockSection
    .createField("cardTheme")
    .name("Card Theme")
    .type("Symbol")
    .validations([{ in: ["pearl", "blue-900"] }]);

  leadBlockSection
    .createField("cardSections")
    .name("Card sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["postItCardSection"] }],
      linkType: "Entry"
    });

  leadBlockSection.changeFieldControl("cardTheme", "builtin", "dropdown");
  leadBlockSection.changeFieldControl(
    "cardSections",
    "builtin",
    "entryLinksEditor"
  );
  leadBlockSection.deleteField("postItCard");
};
