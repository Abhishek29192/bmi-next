import type { MigrationFunction } from "contentful-migration";

export const description = "Change min images from 2 to 3";

export const up: MigrationFunction = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").validations([{ size: { min: 3 } }]);
};

export const down: MigrationFunction = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").validations([{ size: { min: 2 } }]);
};
