module.exports.description = "Create content model for Ridge Tile";

module.exports.up = (migration) => {
  const ridgeTile = migration
    .createContentType("ridgeTile")
    .name("Ridge Tile")
    .displayField("code")
    .description("");

  ridgeTile
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  ridgeTile.createField("name").name("Name").type("Symbol").required(true);

  ridgeTile
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  ridgeTile.createField("image").name("Image").type("Symbol");

  ridgeTile.createField("length").name("Length").type("Number");

  ridgeTile.changeFieldControl("code", "builtin", "singleLine");
  ridgeTile.changeFieldControl("name", "builtin", "singleLine");
  ridgeTile.changeFieldControl("externalProductCode", "builtin", "singleLine");
  ridgeTile.changeFieldControl("image", "builtin", "singleLine");
  ridgeTile.changeFieldControl("length", "builtin", "numberEditor");
};

module.exports.down = (migration) => migration.deleteContentType("ridgeTile");
