const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");

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
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  partnerBrand
    .createField("logo")
    .name("Logo")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  partnerBrand
    .createField("description")
    .name("Description")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  partnerBrand
    .createField("shortDescription")
    .name("Short Description")
    .type("Text")
    .required(true);

  partnerBrand
    .createField("websiteUrl")
    .name("websiteUrl")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: {
          pattern:
            "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
        }
      }
    ]);

  partnerBrand.changeFieldControl("name", "builtin", "singleLine");
  partnerBrand.changeFieldControl("image", "builtin", "assetLinkEditor");
  partnerBrand.changeFieldControl("logo", "builtin", "assetLinkEditor");
  partnerBrand.changeFieldControl("description", "builtin", "richTextEditor", {
    helpText:
      "A long description of the Partner that appears in the Partner Brands page. Note that there is one Partner Brands page per market. The Partner Brands carousel links to the Partner Brands page."
  });
  partnerBrand.changeFieldControl(
    "shortDescription",
    "builtin",
    "multipleLine"
  );
  partnerBrand.changeFieldControl("websiteUrl", "builtin", "urlEditor");
};

module.exports.down = (migration) =>
  migration.deleteContentType("partnerBrand");
