module.exports.description = "Create content model for Verge Metal Flush";

module.exports.up = (migration) => {
  const vergeMetalFlush = migration
    .createContentType("vergeMetalFlush")
    .name("Verge Metal Flush")
    .displayField("code")
    .description("");

  vergeMetalFlush
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  vergeMetalFlush
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  vergeMetalFlush
    .createField("externalProductCode")
    .name("External Product Code (Nobb)")
    .type("Symbol");

  vergeMetalFlush.createField("image").name("Image").type("Symbol");

  vergeMetalFlush.createField("length").name("Length").type("Number");

  vergeMetalFlush.changeFieldControl("code", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl("name", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl(
    "externalProductCode",
    "builtin",
    "singleLine"
  );
  vergeMetalFlush.changeFieldControl("image", "builtin", "singleLine");
  vergeMetalFlush.changeFieldControl("length", "builtin", "numberEditor");
};

module.exports.down = (migration) =>
  migration.deleteContentType("vergeMetalFlush");
