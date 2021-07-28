const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const documentDownloadSection = migration.editContentType(
    "documentDownloadSection"
  );

  documentDownloadSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  documentDownloadSection.displayField("name");
  documentDownloadSection.moveField("name").beforeField("title");
  documentDownloadSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  documentDownloadSection.editField("title").required(false);
  documentDownloadSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "documentDownloadSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const documentDownloadSection = migration.editContentType(
    "documentDownloadSection"
  );

  documentDownloadSection.displayField("title");
  documentDownloadSection.editField("title").required(true);
  documentDownloadSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  documentDownloadSection.deleteField("name");
};
