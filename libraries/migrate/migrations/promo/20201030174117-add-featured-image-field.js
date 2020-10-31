module.exports.description = "Add featuredImage field to content type Promo";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo
    .createField("featuredImage")
    .name("Image")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");

  migration.transformEntries({
    contentType: "promo",
    from: ["image"],
    to: ["featuredImage"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const featuredImage = fromFields.image[currentLocale];

      return { featuredImage };
    }
  });

  promo.moveField("featuredImage").afterField("image");
};

module.exports.down = (migration) => {
  migration.transformEntries({
    contentType: "promo",
    from: ["featuredImage"],
    to: ["image"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const image = fromFields.featuredImage[currentLocale];

      return { image };
    }
  });

  const promo = migration.editContentType("promo");
  promo.deleteField("featuredImage");
};
