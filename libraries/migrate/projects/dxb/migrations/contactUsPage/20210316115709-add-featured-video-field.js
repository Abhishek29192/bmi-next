module.exports.description =
  "Create featuredVideo field to accept video content type link.";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage
    .createField("featuredVideo")
    .name("Featured Video")
    .type("Link")
    .validations([{ linkContentType: ["video"] }])
    .linkType("Entry");

  contactUsPage.changeFieldControl(
    "featuredVideo",
    "builtin",
    "entryLinkEditor",
    {
      helpText: "This field will override 'featuredImage' field when populated."
    }
  );

  contactUsPage.moveField("featuredVideo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.deleteField("featuredVideo");
};
