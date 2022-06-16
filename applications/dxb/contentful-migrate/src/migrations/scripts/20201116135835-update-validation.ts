import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update images field to be required";

export const up: MigrationFunction = (migration: Migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("images").required(false);
};
