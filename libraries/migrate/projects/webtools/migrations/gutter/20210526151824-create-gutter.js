module.exports.description = "Create content model for Gutter";

module.exports.up = (migration) => {
  const gutter = migration
    .createContentType("gutter")
    .name("Gutter")
    .displayField("code")
    .description("");

  gutter
    .createField("code")
    .name("Article Number")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  gutter.createField("image").name("Image").type("Symbol");

  gutter.createField("length").name("Length").type("Number");

  gutter.createField("material").name("Material").type("Symbol");

  gutter
    .createField("variants")
    .name("Variants")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["gutterVariant"] }],
      linkType: "Entry"
    });

  gutter.changeFieldControl("code", "builtin", "singleLine");
  gutter.changeFieldControl("image", "builtin", "singleLine");
  gutter.changeFieldControl("length", "builtin", "numberEditor");
  gutter.changeFieldControl("material", "builtin", "singleLine");
  gutter.changeFieldControl("variants", "builtin", "entryLinksEditor");
};

module.exports.down = (migration) => migration.deleteContentType("gutter");
