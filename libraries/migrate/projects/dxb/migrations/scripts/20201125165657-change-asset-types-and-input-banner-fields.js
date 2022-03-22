"use strict";

module.exports.description =
  "Change assetTypes and inputBanner fields to not required";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.editField("assetTypes").required(false);
  documentLibraryPage.editField("inputBanner").required(false);
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.editField("assetTypes").required(true);
  documentLibraryPage.editField("inputBanner").required(true);
};
