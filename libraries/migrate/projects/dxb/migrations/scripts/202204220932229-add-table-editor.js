const { getExtensions } = require("../../../../utils/makeRequestUtils");

module.exports.description = "Create Table editor content type";

module.exports.up = async (migration, { makeRequest }) => {
  const titleWithContent = migration.editContentType("titleWithContent");
  const table = migration
    .createContentType("tableEditor")
    .name("Table editor")
    .displayField("title");

  table.createField("title").name("Title").type("Text").required(true);

  table.createField("data").name("Data").type("Object");

  const extensions = await getExtensions(makeRequest);

  if (extensions && extensions.items) {
    const tableEditorExtension = extensions.items.find(
      (item) => item.extension.name === "table field editor"
    );
    if (tableEditorExtension) {
      table.changeFieldControl(
        "data",
        "extension",
        tableEditorExtension.sys.id
      );
    }
  }

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

  migration.deleteContentType("tableEditor");

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
