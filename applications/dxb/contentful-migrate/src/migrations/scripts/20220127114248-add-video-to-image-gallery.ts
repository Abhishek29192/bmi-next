import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add video content type to image gallery";

export const up: MigrationFunction = (migration: Migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("medias").items({
    type: "Link",
    validations: [{ linkContentType: ["video", "image"] }],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const gallery = migration.editContentType("imageGallerySection");
  gallery.editField("medias").items({
    type: "Link",
    validations: [{ linkContentType: ["image"] }],
    linkType: "Entry"
  });
};
