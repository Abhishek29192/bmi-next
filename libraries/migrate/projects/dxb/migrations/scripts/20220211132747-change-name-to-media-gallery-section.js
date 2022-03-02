"use strict";

module.exports.description = "Change name to Media Gallery Section";

module.exports.up = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.name("Media Gallery Section");
};

module.exports.down = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.name("Image Gallery Section");
};
