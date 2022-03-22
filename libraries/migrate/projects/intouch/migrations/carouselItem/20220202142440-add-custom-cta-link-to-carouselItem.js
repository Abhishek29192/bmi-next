module.exports.description =
  "Create new custom external link CTA for Carousel Item";

module.exports.up = (migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("cta", {
    validations: [
      { in: ["PROJECT", "TRAINING", "MERCHANDISE", "CUSTOM", "NONE"] }
    ]
  });

  carouselItem.createField("customUrl").name("Custom CTA URL").type("Symbol");
  carouselItem
    .createField("customUrlButtonText")
    .name("Custom CTA URL Button Text")
    .type("Symbol");

  carouselItem.moveField("customUrl").afterField("cta");
  carouselItem.moveField("customUrlButtonText").afterField("customUrl");

  carouselItem.changeFieldControl("cta", "builtin", "radio");
  carouselItem.changeFieldControl("customUrl", "builtin", "singleLine", {
    helpText: "The custom CTA URL when select 'CUSTOM' from CTA Field"
  });
};

module.exports.down = (migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("cta", {
    validations: [{ in: ["PROJECT", "TRAINING", "MERCHANDISE", "NONE"] }]
  });

  carouselItem.changeFieldControl("cta", "builtin", "radio");

  carouselItem.deleteField("customUrl");
  carouselItem.deleteField("customUrlButtonText");
};
