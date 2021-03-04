module.exports.description =
  "Delete tag field from document library page content type";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("tag");
};
