"use strict";

module.exports.description = "Add helpText to resultsType field";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText:
      "Select an appropriate Results Type based on the Source. PIM: Select simple or technical. CMS: Select simple or cards. ALL: Select only simple"
  });
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText: ""
  });
};
