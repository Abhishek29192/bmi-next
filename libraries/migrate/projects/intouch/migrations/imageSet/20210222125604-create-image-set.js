const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");

module.exports.description = "Create content model for Image Set";

module.exports.up = (migration) => {
  const imageSet = migration
    .createContentType("imageSet")
    .name("Image Set")
    .displayField("name")
    .description("A set of images for use on different resolutions");

  imageSet.createField("name").name("Name").type("Symbol").required(true);

  imageSet
    .createField("altText")
    .name("Alt Text")
    .type("Symbol")
    .required(true);

  imageSet
    .createField("desktopImage")
    .name("DesktopImage")
    .type("Link")
    .required(true)
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  imageSet
    .createField("wideImage")
    .name("WideImage")
    .type("Link")
    .required(true)
    .validations([{ assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }])
    .linkType("Asset");

  imageSet
    .createField("tabletImage")
    .name("TabletImage")
    .type("Link")
    .required(true)
    .validations([{ assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }])
    .linkType("Asset");

  imageSet
    .createField("mobileImage")
    .name("MobileImage")
    .type("Link")
    .required(true)
    .validations([{ assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }])
    .linkType("Asset");

  imageSet.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "A short name for the Image Set"
  });
  imageSet.changeFieldControl("altText", "builtin", "singleLine", {
    helpText: "Provide alt text for screen-readers and broken images."
  });
  imageSet.changeFieldControl("desktopImage", "builtin", "assetLinkEditor");
  imageSet.changeFieldControl("wideImage", "builtin", "assetLinkEditor", {
    helpText: "Reference to widescreen image or the image itself",
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  imageSet.changeFieldControl("tabletImage", "builtin", "assetLinkEditor", {
    helpText: "Reference to tablet image or the image itself",
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  imageSet.changeFieldControl("mobileImage", "builtin", "assetLinkEditor", {
    helpText: "Reference to mobile phone image or the image itself",
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
};

module.exports.down = (migration) => migration.deleteContentType("imageSet");
