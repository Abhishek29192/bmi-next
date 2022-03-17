module.exports.description = "Add a document name map field";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("productDocumentNameMap")
    .name("Product documents name map")
    .type("Symbol")
    .validations([{ in: ["Document name", "Product name + asset type"] }]);

  resources.changeFieldControl(
    "productDocumentNameMap",
    "builtin",
    "dropdown",
    {
      helpText:
        'Define how PIM documents\' names will be displayed. Defaults to "Document name".'
    }
  );
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("productDocumentNameMap");
};
