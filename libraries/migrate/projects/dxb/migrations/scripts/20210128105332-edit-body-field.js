module.exports.description = "Edit required status of the body field";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("body").required(false);
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("body").required(true);
};
