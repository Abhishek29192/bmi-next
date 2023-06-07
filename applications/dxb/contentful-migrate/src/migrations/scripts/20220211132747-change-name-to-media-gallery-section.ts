import type { MigrationFunction } from "contentful-migration";

export const description = "Change name to Media Gallery Section";

export const up: MigrationFunction = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.name("Media Gallery Section");
};

export const down: MigrationFunction = (migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.name("Image Gallery Section");
};
