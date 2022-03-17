module.exports.description = "Add breadcrumb title field to brandLandingPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

module.exports.down = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.deleteField("breadcrumbTitle");
};
