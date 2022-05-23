const { internalName } = require("../../variables/helpText/20210421160910");
module.exports.description = "Add name field for team section";

module.exports.up = (migration) => {
  const teamSection = migration.editContentType("teamSection");
  teamSection.createField("name").name("Name").type("Symbol").required(true);
  teamSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  teamSection.displayField("name");
  teamSection.moveField("name").beforeField("title");

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
  const teamSection = migration.editContentType("teamSection");
  teamSection.deleteField("name");
  teamSection.displayField("title");
};
