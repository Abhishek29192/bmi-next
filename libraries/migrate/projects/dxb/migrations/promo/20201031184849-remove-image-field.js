module.exports.description = "Remove image field from content type promo";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  migration.transformEntries({
    contentType: "promo",
    from: ["image"],
    to: ["featuredImage"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const featuredImage = fromFields.image
        ? fromFields.image[currentLocale]
        : undefined;

      return { featuredImage };
    }
  });

  promo.deleteField("image");
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  promo
    .createField("image")
    .name("Image")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  promo.changeFieldControl("image", "builtin", "assetLinkEditor");
  promo.moveField("image").beforeField("featuredImage");
};
