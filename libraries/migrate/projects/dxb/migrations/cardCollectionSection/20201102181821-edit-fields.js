module.exports.description = "Update the card content type";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    // NOTE: The "Next Best Action Card" should be removed when next best action card gets its own CT.
    .validations([
      { in: ["Highlight Card", "Story Card", "Next Best Action Card"] }
    ]);

  cardCollectionSection.editField("cardLabel").name("CTA Label");

  cardCollectionSection
    .createField("groupCards")
    .name("Group Cards")
    .type("Boolean");

  cardCollectionSection
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

  cardCollectionSection
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  cardCollectionSection.changeFieldControl("groupCards", "builtin", "boolean", {
    helpText: "Use tags from selected Promos and Pages to group the cards"
  });
  cardCollectionSection.changeFieldControl(
    "description",
    "builtin",
    "richTextEditor"
  );
  cardCollectionSection.changeFieldControl(
    "link",
    "builtin",
    "entryLinkEditor"
  );

  cardCollectionSection.moveField("description").afterField("title");
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([
      { in: ["Product Overview Card", "Next Best Action Card", "CTA Card"] }
    ]);

  cardCollectionSection.editField("cardLabel").name("Card Label");

  cardCollectionSection.deleteField("groupCards");
  cardCollectionSection.deleteField("description");
  cardCollectionSection.deleteField("link");
};
