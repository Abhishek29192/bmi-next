module.exports.description = "Create content model for Evidence Category";

module.exports.up = (migration) => {
  const evidenceCategory = migration
    .createContentType("evidenceCategory")
    .name("Evidence Category")
    .displayField("name")
    .description(
      "A category of evidence required by a Market for guarantees to be issued"
    );

  evidenceCategory
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  evidenceCategory
    .createField("description")
    .name("Description")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  evidenceCategory
    .createField("minimumUploads")
    .name("Minimum Uploads")
    .type("Integer")
    .required(true)
    .validations([
      { range: { min: 1 }, message: "At least 1 upload is necessary" }
    ]);

  evidenceCategory.changeFieldControl("name", "builtin", "singleLine");
  evidenceCategory.changeFieldControl(
    "description",
    "builtin",
    "richTextEditor"
  );
  evidenceCategory.changeFieldControl(
    "minimumUploads",
    "builtin",
    "numberEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("evidenceCategory");
