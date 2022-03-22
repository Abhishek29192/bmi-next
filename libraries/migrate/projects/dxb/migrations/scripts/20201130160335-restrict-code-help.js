module.exports.description = "Add help text to code";

module.exports.up = (migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([{ size: { max: 4 } }]);

  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: "This is the abbreviation for the name."
  });
};

module.exports.down = (migration) => {
  const assetType = migration.editContentType("assetType");

  assetType.editField("code").validations([]);
  assetType.changeFieldControl("code", "builtin", "singleLine", {
    helpText: ""
  });
};
