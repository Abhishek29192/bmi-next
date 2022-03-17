module.exports.description = "Add order form to sample basket content type";

module.exports.up = (migration) => {
  const sampleBasket = migration.editContentType("sampleBasket");

  sampleBasket
    .createField("checkoutFormSection")
    .name("Order Form")
    .type("Link")
    .validations([{ linkContentType: ["form"] }])
    .linkType("Entry");
};

module.exports.down = (migration) =>
  migration.editContentType("sampleBasket").deleteField("checkoutFormSection");
