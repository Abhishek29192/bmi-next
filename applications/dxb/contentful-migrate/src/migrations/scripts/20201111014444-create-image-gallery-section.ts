import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create Image Gallery Section";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("imageGallerySection");
};
