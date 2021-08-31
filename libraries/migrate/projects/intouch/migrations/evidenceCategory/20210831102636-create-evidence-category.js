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
    .createField("referenceCode")
    .name("Reference Code")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        in: [
          "PITCHED_DETAILS",
          "PITCHED_TILES",
          "PITCHED_BASE",
          "PITCHED_UNDERLAY",
          "PITCHED_VENTILATION",
          "PITCHED_PENETRATIONS",
          "PITCHED_FIXINGS",
          "PITCHED_INSULATION",
          "PITCHED_INSPECTION",
          "PITCHED_SAFETY",
          "PITCHED_PLAN",
          "FLAT_DETAILS",
          "FLAT_TOP",
          "FLAT_BASE",
          "FLAT_LAYER",
          "FLAT_VENTILATION",
          "FLAT_PENETRATIONS",
          "FLAT_FIXINGS",
          "FLAT_INSULATION",
          "FLAT_SAFETY",
          "FLAT_PLAN",
          "MISC_1",
          "MISC_2",
          "MISC_3",
          "MISC_4"
        ]
      }
    ]);

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
  evidenceCategory.changeFieldControl("referenceCode", "builtin", "dropdown", {
    helpText:
      "This field ensures the uniqueness of the Evidence category entry in Contentful"
  });
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
