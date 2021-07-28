"use strict";

module.exports.description = "Create Image Gallery Section";

module.exports.up = (migration) => {
  const gallery = migration
    .createContentType("imageGallerySection")
    .name("Image Gallery Section")
    .displayField("title");

  gallery
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  gallery.createField("description").name("Description").type("Text");

  gallery
    .createField("images")
    .name("images")
    .type("Array")
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [
        { linkMimetypeGroup: ["image"] },
        {
          assetFileSize: {
            max: 2097152
          }
        }
      ],
      linkType: "Asset"
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType("imageGallerySection");
};
