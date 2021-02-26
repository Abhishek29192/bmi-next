module.exports.description =
  "Delete tag field from product lister page content type";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.deleteField("tag");
};
