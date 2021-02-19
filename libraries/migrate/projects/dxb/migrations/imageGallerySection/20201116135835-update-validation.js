"use strict";

module.exports.description = "Update images field to be required";

module.exports.up = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").required(true);
};

module.exports.down = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").required(false);
};
