module.exports.description = "Create content model for Partner Brand";

module.exports.up = (migration) => {
  const partnerBrand = migration
    .createContentType("partnerBrand")
    .name("Partner Brand")
    .displayField("name")
    .description("MarketAdmin could change these every 6 months");

  partnerBrand
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  partnerBrand
    .createField("image")
    .name("Image")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["imageSet"] }])
    .linkType("Entry");

  partnerBrand
    .createField("desciption")
    .name("Desciption")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  partnerBrand
    .createField("shortDescription")
    .name("Short Description")
    .type("Text")
    .required(true);

  partnerBrand.changeFieldControl("name", "builtin", "singleLine");
  partnerBrand.changeFieldControl("image", "builtin", "entryLinkEditor");
  partnerBrand.changeFieldControl("desciption", "builtin", "richTextEditor", {
    helpText:
      "A long description of the Partner that appears in the Partner Brands page. Note that there is one Partner Brands page per market. The Partner Brands carousel links to the Partner Brands page."
  });
  partnerBrand.changeFieldControl(
    "shortDescription",
    "builtin",
    "multipleLine"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("partnerBrand");
