module.exports.description =
  "Add help text to featuredImage field on teamPage content type.";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage.changeFieldControl("featuredImage", "builtin", "assetLinkEditor", {
    helpText:
      "Although the Featured Image is not always visible on the page hero, it is good practice to include one whenever possible since that image will be shown as a thumbnail when the page is linked externally."
  });
};

module.exports.down = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage.changeFieldControl("featuredImage", "builtin", "assetLinkEditor", {
    helpText: ""
  });
};
