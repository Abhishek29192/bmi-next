"use strict";

module.exports.description = "Change min images from 2 to 3";

module.exports.up = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").validations([{ size: { min: 3 } }]);
};

module.exports.down = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").validations([{ size: { min: 2 } }]);
};
