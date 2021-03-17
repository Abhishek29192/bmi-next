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

  evidenceCategory
    .createField("locked")
    .name("Locked")
    .type("Boolean")
    .required(true);

  evidenceCategory
    .createField("ranking")
    .name("Ranking")
    .type("Integer")
    .required(true)
    .validations([{ unique: true }, { range: { min: 1 } }]);

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
  evidenceCategory.changeFieldControl("locked", "builtin", "boolean");
  evidenceCategory.changeFieldControl("ranking", "builtin", "numberEditor", {
    helpText: "The order in which it is listed amongst other categories"
  });
};

module.exports.down = (migration) =>
  migration.deleteContentType("evidenceCategory");
