const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  titleWithContent.displayField("name");
  titleWithContent.moveField("name").beforeField("title");
  titleWithContent.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  titleWithContent.editField("title").required(false);
  titleWithContent.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "titleWithContent",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const titleWithContent = migration.editContentType("titleWithContent");

  titleWithContent.displayField("title");
  titleWithContent.editField("title").required(true);
  titleWithContent.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  titleWithContent.deleteField("name");
};
