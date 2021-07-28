module.exports.description = "Add video content type to image gallery";

module.exports.up = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("medias").items({
    type: "Link",
    validations: [{ linkContentType: ["video", "image"] }],
    linkType: "Entry"
  });
};

module.exports.down = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("medias").items({
    type: "Link",
    validations: [{ linkContentType: ["image"] }],
    linkType: "Entry"
  });
};
