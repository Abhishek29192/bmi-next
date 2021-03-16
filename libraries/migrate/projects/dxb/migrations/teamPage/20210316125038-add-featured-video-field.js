module.exports.description =
  "Create featuredVideo field to accept video content type link.";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  teamPage.changeFieldControl("featuredVideo", "builtin", "entryLinkEditor", {
    helpText: "This field will override 'featuredImage' field when populated."
  });

  teamPage.moveField("featuredVideo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage.deleteField("featuredVideo");
};
