module.exports.description = "Create sample basket content type";

module.exports.up = (migration) => {
  const sampleBasket = migration
    .createContentType("sampleBasket")
    .name("Sample Basket Section")
    .displayField("title")
    .description("");

  sampleBasket
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true);

  sampleBasket
    .createField("description")
    .name("Description")
    .type("RichText")
    .localized(true)
    .validations([{ nodes: {} }]);
};

module.exports.down = (migration) =>
  migration.deleteContentType("sampleBasket");
