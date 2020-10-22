module.exports.description = "Create content model for Two Column Section";

module.exports.up = (migration) => {
  const twoColumnSection = migration
    .createContentType("twoColumnSection")
    .name("Two Column Section")
    .description("");

  twoColumnSection
    .createField("leftColumn")
    .name("Left Column")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");

  twoColumnSection
    .createField("rightColumn")
    .name("Right Column")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["imageWrapper", "titleWithContent"] }])
    .linkType("Entry");

  twoColumnSection.changeFieldControl(
    "leftColumn",
    "builtin",
    "entryLinkEditor"
  );
  twoColumnSection.changeFieldControl(
    "rightColumn",
    "builtin",
    "entryLinkEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("twoColumnSection");
