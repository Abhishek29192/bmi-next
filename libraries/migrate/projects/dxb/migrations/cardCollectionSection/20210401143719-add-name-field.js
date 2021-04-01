const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  cardCollectionSection.displayField("name");
  cardCollectionSection.moveField("name").beforeField("title");
  cardCollectionSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  cardCollectionSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "cardCollectionSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.displayField("title");
  cardCollectionSection.deleteField("name");
};
