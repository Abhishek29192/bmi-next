module.exports.description = "Add breadcrumb title field to productListerPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("productListerPage");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("breadcrumbTitle");
};
