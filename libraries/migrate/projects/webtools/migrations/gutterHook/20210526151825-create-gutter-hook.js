module.exports.description = "Create content model for Gutter Hook";

module.exports.up = (migration) => {
  const gutterHook = migration
    .createContentType("gutterHook")
    .name("Gutter Hook")
    .displayField("code")
    .description("");

  gutterHook
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  gutterHook.createField("name").name("Name").type("Symbol").required(true);

  gutterHook
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  gutterHook.createField("image").name("Image").type("Symbol");

  gutterHook
    .createField("distanceBetweenHooks")
    .name("Distance between hooks")
    .type("Number");

  gutterHook.createField("color").name("Colour").type("Symbol");

  gutterHook.changeFieldControl("code", "builtin", "singleLine");
  gutterHook.changeFieldControl("name", "builtin", "singleLine");
  gutterHook.changeFieldControl("externalProductCode", "builtin", "singleLine");
  gutterHook.changeFieldControl("image", "builtin", "singleLine");
  gutterHook.changeFieldControl(
    "distanceBetweenHooks",
    "builtin",
    "numberEditor"
  );
  gutterHook.changeFieldControl("color", "builtin", "singleLine");
};

module.exports.down = (migration) => migration.deleteContentType("gutterHook");
