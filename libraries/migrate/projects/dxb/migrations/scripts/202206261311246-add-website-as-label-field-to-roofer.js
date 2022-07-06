module.exports.description = "Add website as label field";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("websiteLinkAsLabel")
    .name("Display website link as label")
    .type("Boolean");

  roofer.changeFieldControl("websiteLinkAsLabel", "builtin", "boolean", {
    helpText:
      "Use a micro copy instead of an URL when displaying the website link."
  });

  roofer.moveField("websiteLinkAsLabel").afterField("website");
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("websiteLinkAsLabel");
};
