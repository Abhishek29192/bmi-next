module.exports.description = "Add breadcrumb title field to contactUsPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("contactUsPage");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.deleteField("breadcrumbTitle");
};
