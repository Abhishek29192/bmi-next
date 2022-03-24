const { internalName } = require("../../variables/helpText/20210421160910");
module.exports.description = "Add name field for carousel section";

module.exports.up = (migration) => {
  const carouselSection = migration.editContentType("carouselSection");
  carouselSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  carouselSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  carouselSection.displayField("name");
  carouselSection.moveField("name").beforeField("title");

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
  const carouselSection = migration.editContentType("carouselSection");
  carouselSection.deleteField("name");
  carouselSection.displayField("title");
};
