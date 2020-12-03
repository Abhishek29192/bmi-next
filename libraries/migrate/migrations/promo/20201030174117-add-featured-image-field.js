module.exports.description = "Add featuredImage field to content type Promo";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
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
