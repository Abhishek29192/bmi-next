"use strict";

module.exports.description =
  "Add allow filter by field on Document Library Page";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("allowFilterBy")
    .name("Allow Filter By")
    .type("Array")
    .required(false)
    .items({
      type: "Symbol",
      validations: []
    });

  documentLibraryPage.changeFieldControl(
    "allowFilterBy",
    "builtin",
    "tagEditor",
    {
      helpText:
        "type the filter value and hit enter, note the value should match with the PIM name (ex: 'Category', 'Category | PITCHED_ROOF_NO', 'PITCHED_ROOF_NO')"
    }
  );

  documentLibraryPage.moveField("allowFilterBy").afterField("categoryCodes");
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("allowFilterBy");
};
