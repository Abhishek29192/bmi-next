module.exports.description = "Delete tag field from promo page content type";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.deleteField("tag");
};
