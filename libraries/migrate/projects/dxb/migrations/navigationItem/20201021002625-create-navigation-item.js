module.exports.description = "Create content model for Navigation Item";

module.exports.up = (migration) => {
  const navigationItem = migration
    .createContentType("navigationItem")
    .name("Navigation Item")
    .displayField("title")
    .description("");

  navigationItem
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  navigationItem
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Separator", "Heading"] }]);

  navigationItem.createField("value").name("Value").type("Symbol");

  navigationItem.changeFieldControl("title", "builtin", "singleLine");
  navigationItem.changeFieldControl("type", "builtin", "dropdown");
  navigationItem.changeFieldControl("value", "builtin", "singleLine");
};

module.exports.down = (migration) =>
  migration.deleteContentType("navigationItem");
