const { internalName } = require("../../variables/helpText/20210421160910");
module.exports.description = "Add name field for document library page";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  documentLibraryPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  documentLibraryPage.displayField("name");
  documentLibraryPage.moveField("name").beforeField("title");

  migration.transformEntries({
    contentType: "page",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]).replace(/\|/gi, "")
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.deleteField("name");
  documentLibraryPage.displayField("title");
};
