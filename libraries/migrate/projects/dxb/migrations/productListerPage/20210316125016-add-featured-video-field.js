module.exports.description =
  "Create featuredVideo field to accept video content type link.";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  productListerPage.changeFieldControl(
    "featuredVideo",
    "builtin",
    "entryLinkEditor",
    {
      helpText: "This field will override 'featuredImage' field when populated."
    }
  );

  productListerPage.moveField("featuredVideo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("featuredVideo");
};
