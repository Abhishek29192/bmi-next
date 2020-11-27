module.exports.description =
  "Create content type for Document Download Section";

module.exports.up = (migration) => {
  const documentDownloadSection = migration
    .createContentType("documentDownloadSection")
    .name("Document Download Section")
    .displayField("title")
    .description("");

  documentDownloadSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  documentDownloadSection
    .createField("description")
    .name("Description")
    .type("RichText")
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

  documentDownloadSection
    .createField("documents")
    .name("Documents")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["document"] }],
      linkType: "Entry"
    });
};

module.exports.down = (migration) =>
  migration.deleteContentType("documentDownloadSection");
