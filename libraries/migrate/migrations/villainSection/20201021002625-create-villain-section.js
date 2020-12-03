module.exports.description = "Create content model for Villain Section";

module.exports.up = (migration) => {
  const villainSection = migration
    .createContentType("villainSection")
    .name("Villain Section")
    .displayField("title")
    .description("");

  villainSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  villainSection
    .createField("promo")
    .name("Promo")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["contactUsPage", "promo", "page"] }])
    .linkType("Entry");

  villainSection
    .createField("isReversed")
    .name("Reverse Villain")
    .type("Boolean");

  villainSection.changeFieldControl("title", "builtin", "singleLine");
  villainSection.changeFieldControl("promo", "builtin", "entryLinkEditor");
  villainSection.changeFieldControl("isReversed", "builtin", "boolean");
};

module.exports.down = (migration) =>
  migration.deleteContentType("villainSection");
