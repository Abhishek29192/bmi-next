module.exports.description = "Add key asset types field";

const field = "keyAssetTypes";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("Key Asset Types")
    .type("Array")
    .required(false)
    .validations([{ size: { max: 3 } }])
    .items({
      type: "Symbol"
    });

  resources.changeFieldControl(field, "builtin", "tagEditor", {
    helpText: "This is the code which is an abbreviation of the asset type"
  });
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
