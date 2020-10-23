module.exports.description = "Create content model for Post-it Card Section";

module.exports.up = (migration) => {
  const postItCardSection = migration
    .createContentType("postItCardSection")
    .name("Post-it Card Section")
    .displayField("title")
    .description("");

  postItCardSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  postItCardSection
    .createField("hasUnderline")
    .name("Has underline")
    .type("Boolean");

  postItCardSection
    .createField("description")
    .name("Description")
    .type("Text")
    .required(true);

  postItCardSection
    .createField("link")
    .name("Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  postItCardSection
    .createField("linkType")
    .name("Link type")
    .type("Symbol")
    .validations([{ in: ["button", "link"] }]);

  postItCardSection.changeFieldControl("title", "builtin", "singleLine");
  postItCardSection.changeFieldControl("hasUnderline", "builtin", "boolean", {
    helpText: "Whether title has an underline below it",
    trueLabel: "Yes",
    falseLabel: "No"
  });
  postItCardSection.changeFieldControl(
    "description",
    "builtin",
    "multipleLine"
  );
  postItCardSection.changeFieldControl("link", "builtin", "entryLinkEditor");
  postItCardSection.changeFieldControl("linkType", "builtin", "radio");
};

module.exports.down = (migration) =>
  migration.deleteContentType("postItCardSection");
