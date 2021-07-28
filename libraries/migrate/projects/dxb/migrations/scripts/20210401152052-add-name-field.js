const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const linkColumnsSection = migration.editContentType("linkColumnsSection");

  linkColumnsSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  linkColumnsSection.displayField("name");
  linkColumnsSection.moveField("name").beforeField("title");
  linkColumnsSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  linkColumnsSection.editField("title").required(false);
  linkColumnsSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "linkColumnsSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const linkColumnsSection = migration.editContentType("linkColumnsSection");

  linkColumnsSection.displayField("title");
  linkColumnsSection.editField("title").required(true);
  linkColumnsSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  linkColumnsSection.deleteField("name");
};
