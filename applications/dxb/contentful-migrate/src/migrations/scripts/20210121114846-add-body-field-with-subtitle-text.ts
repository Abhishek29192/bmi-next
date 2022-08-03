import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add body field with subtitle text to content type";

const enabledNodeTypes = [
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
];

export const up: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .validations([
      {
        enabledNodeTypes,
        message: `Only ${enabledNodeTypes
          .map((nodeType) => nodeType.replace(/-/g, " "))
          .join(", ")} nodes are allowed`
      },
      {
        nodes: {
          "embedded-entry-block": [{ linkContentType: ["link", "table"] }],
          "embedded-entry-inline": [{ linkContentType: ["link"] }]
        }
      }
    ]);

  promo.changeFieldControl("body", "builtin", "richTextEditor", {
    helpText: "The body content will be used for page content."
  });

  promo.moveField("body").afterField("subtitle");

  promo.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText: "The subtitle content will be used for the content of cards."
  });

  migration.transformEntries({
    contentType: "promo",
    from: ["subtitle"],
    to: ["body"],
    transformEntryForLocale: async ({ subtitle }, currentLocale) => {
      if (!subtitle) {
        return;
      }

      return {
        body: {
          nodeType: "document",
          data: {},
          content: [
            {
              nodeType: "paragraph",
              content: [
                {
                  nodeType: "text",
                  marks: [],
                  value: subtitle[currentLocale],
                  data: {}
                }
              ],
              data: {}
            }
          ]
        }
      };
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText: ""
  });

  promo.deleteField("body");
};
