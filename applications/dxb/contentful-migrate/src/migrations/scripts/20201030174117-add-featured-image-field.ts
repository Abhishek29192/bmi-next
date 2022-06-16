import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add featuredImage field to content type Promo";

export const up: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  promo
    .createField("featuredImage")
    .name("Image")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  promo.changeFieldControl("featuredImage", "builtin", "assetLinkEditor");
  promo.moveField("featuredImage").afterField("image");
};

export const down: MigrationFunction = (migration: Migration) => {
  const promo = migration.editContentType("promo");

  migration.transformEntries({
    contentType: "promo",
    from: ["featuredImage"],
    to: ["image"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const image = fromFields.featuredImage
        ? fromFields.featuredImage[currentLocale]
        : undefined;

      return { image };
    }
  });

  promo.deleteField("featuredImage");
};
