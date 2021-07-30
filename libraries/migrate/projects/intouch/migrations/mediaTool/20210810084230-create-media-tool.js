const { MAX_FILE_SIZES } = require("../../variables/mediaSizes/20210222125604");

module.exports.description = "Create content model for Media Tool";

module.exports.up = (migration) => {
  const mediaTool = migration
    .createContentType("mediaTool")
    .name("Media Tool")
    .displayField("name")
    .description("Media which is hosted on Contentful");

  mediaTool.createField("name").name("Name").type("Symbol").required(true);

  mediaTool
    .createField("thumbnail")
    .name("Thumbnail")
    .type("Link")
    .validations([
      { linkMimetypeGroup: ["image"] },
      { assetFileSize: { max: MAX_FILE_SIZES.IMAGE } }
    ])
    .linkType("Asset");

  mediaTool
    .createField("media")
    .name("Media")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image", "video", "pdfdocument"] }])
    .linkType("Asset");

  mediaTool
    .createField("url")
    .name("url")
    .type("Symbol")
    .validations([{ unique: true }]);

  mediaTool.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "Name of the entry (helpful to find the entry when searching for content in Contentful Web App)"
  });
  mediaTool.changeFieldControl("thumbnail", "builtin", "assetLinkEditor");
  mediaTool.changeFieldControl("media", "builtin", "assetLinkEditor");
  mediaTool.changeFieldControl("url", "builtin", "urlEditor");
};

module.exports.down = (migration) => migration.deleteContentType("mediaTool");
