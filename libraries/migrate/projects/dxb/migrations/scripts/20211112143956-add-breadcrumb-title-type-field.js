module.exports.description = "Add breadcrumb title field to page.";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("breadcrumbTitle");
};
