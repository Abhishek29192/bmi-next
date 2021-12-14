module.exports.description =
  "Update Category Codes field on Document Library Page";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("categoryCodes")
    .name("Category Codes")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });
  documentLibraryPage.moveField("categoryCodes").afterField("assetTypes");
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("categoryCodes");
};
