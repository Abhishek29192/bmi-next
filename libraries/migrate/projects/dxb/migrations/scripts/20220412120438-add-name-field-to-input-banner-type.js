const { internalName } = require("../../variables/helpText/20210421160910");
module.exports.description = "Add name field for input banner type";

module.exports.up = (migration) => {
  const inputBanner = migration.editContentType("inputBanner");
  inputBanner.createField("name").name("Name").type("Symbol").required(true);
  inputBanner.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  inputBanner.displayField("name");
  inputBanner.moveField("name").beforeField("title");

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
  const inputBanner = migration.editContentType("document");
  inputBanner.deleteField("name");
  inputBanner.displayField("title");
};
