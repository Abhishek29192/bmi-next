module.exports.description =
  "Create featuredVideo field to accept video content type link.";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");
  promo
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  promo.changeFieldControl("featuredVideo", "builtin", "entryLinkEditor", {
    helpText: "This field will override 'featuredImage' field when populated."
  });

  promo.moveField("featuredVideo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");
  promo.deleteField("featuredVideo");
};
