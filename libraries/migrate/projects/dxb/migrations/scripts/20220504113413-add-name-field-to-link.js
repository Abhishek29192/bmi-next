const { internalName } = require("../../variables/helpText/20210421160910");
const { hyphenSymbol } = require("../../variables/hyphenSymbol/20220504110700");

module.exports.description = "Add name field for link";
const titleNotFound = "Untitled";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");
  link.createField("name").name("Name").type("Symbol").required(true);
  link.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  link.displayField("name");
  link.moveField("name").beforeField("label");

  migration.transformEntries({
    contentType: "link",
    from: ["label"],
    to: ["name"],
    transformEntryForLocale: async ({ label }, currentLocale) => {
      if (!label) {
        return {
          name: titleNotFound,
          label: titleNotFound
        };
      }
      return {
        name: label[currentLocale].replace(hyphenSymbol, ""),
        label: label[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");
  link.displayField("label");
  link.deleteField("name");
};
