module.exports.description =
  "Add breadcrumb title field to documentLibraryPage.";

module.exports.up = (migration) => {
  const page = migration.editContentType("documentLibraryPage");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.deleteField("breadcrumbTitle");
};
