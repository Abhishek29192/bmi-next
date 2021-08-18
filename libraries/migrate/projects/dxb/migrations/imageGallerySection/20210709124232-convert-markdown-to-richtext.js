const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown");

module.exports.description = "Convert Markdown to RichText";

module.exports.up = (migration) => {
  const contentType = migration.editContentType("imageGallerySection");

  contentType
    .createField("longDescription")
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

  contentType.changeFieldControl(
    "longDescription",
    "builtin",
    "richTextEditor"
  );

  contentType.moveField("longDescription").beforeField("medias");

  migration.transformEntries({
    contentType: "imageGallerySection",
    from: ["description"],
    to: ["longDescription"],
    transformEntryForLocale: async ({ description }, currentLocale) => ({
      longDescription: await richTextFromMarkdown(
        (description && description[currentLocale]) || ""
      )
    }),
    shouldPublish: "preserve"
  });

  contentType.editField("description").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const contentType = migration.editContentType("imageGallerySection");

  contentType.editField("description").disabled(false).omitted(false);

  contentType.deleteField("longDescription");
};
