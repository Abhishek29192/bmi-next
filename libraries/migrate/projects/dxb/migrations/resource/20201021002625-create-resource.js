module.exports.description = "Create content model for Resource";

module.exports.up = (migration) => {
  const resource = migration
    .createContentType("resource")
    .name("Resource")
    .displayField("key")
    .description("");

  resource
    .createField("key")
    .name("Key")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  resource.createField("value").name("Value").type("Symbol").required(true);

  resource.changeFieldControl("key", "builtin", "singleLine");
  resource.changeFieldControl("value", "builtin", "singleLine");
};

module.exports.down = (migration) => migration.deleteContentType("resource");
