module.exports.description =
  "Add help text to featuredImage field on contactUsPage content type.";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor",
    {
      helpText:
        "Although the Featured Image is not always visible on the page hero, it is good practice to include one whenever possible since that image will be shown as a thumbnail when the page is linked externally."
    }
  );
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor",
    {
      helpText: ""
    }
  );
};
