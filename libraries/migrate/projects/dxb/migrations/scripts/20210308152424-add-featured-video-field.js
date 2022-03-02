module.exports.description =
  "Create featuredVideo field to accept video content type link.";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  page.changeFieldControl("featuredVideo", "builtin", "entryLinkEditor", {
    helpText: "This field will override 'featuredImage' field when populated."
  });

  page.moveField("featuredVideo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("featuredVideo");
};
