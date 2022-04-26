module.exports.description = "Add tableEditor option";

module.exports.up = (migration) => {
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
        "embedded-entry-block": [
          { linkContentType: ["link", "table", "tableEditor"] }
        ],
        "embedded-entry-inline": [{ linkContentType: ["link"] }]
      }
    }
  ]);
};

module.exports.down = (migration) => {
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
