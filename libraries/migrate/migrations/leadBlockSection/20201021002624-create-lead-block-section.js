module.exports.description = "Create content model for Lead Block Section";

module.exports.up = (migration) => {
  const leadBlockSection = migration
    .createContentType("leadBlockSection")
    .name("Lead Block Section")
    .displayField("title")
    .description("");

  leadBlockSection.createField("title").name("Title").type("Symbol");

  leadBlockSection
    .createField("text")
    .name("Text")
    .type("RichText")
    .required(true)
    .validations([
      { enabledMarks: ["bold"], message: "Only bold marks are allowed" },
      {
        enabledNodeTypes: ["heading-2"],
        message: "Only heading 2 nodes are allowed"
      },
      { nodes: {} }
    ]);

  leadBlockSection
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

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

  leadBlockSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "Used for identifying item in contentful only"
  });
  leadBlockSection.changeFieldControl("text", "builtin", "richTextEditor");
  leadBlockSection.changeFieldControl("link", "builtin", "entryLinkEditor", {
    helpText: "Optional CTA Button at the bottom",
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  leadBlockSection.changeFieldControl("cardTheme", "builtin", "dropdown");
  leadBlockSection.changeFieldControl(
    "cardSections",
    "builtin",
    "entryLinksEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("leadBlockSection");
