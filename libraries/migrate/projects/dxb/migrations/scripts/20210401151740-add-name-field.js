const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const tabsOrAccordionSection = migration.editContentType(
    "tabsOrAccordionSection"
  );

  tabsOrAccordionSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  tabsOrAccordionSection.displayField("name");
  tabsOrAccordionSection.moveField("name").beforeField("title");
  tabsOrAccordionSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  tabsOrAccordionSection.editField("title").required(false);
  tabsOrAccordionSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "tabsOrAccordionSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const tabsOrAccordionSection = migration.editContentType(
    "tabsOrAccordionSection"
  );

  tabsOrAccordionSection.displayField("title");
  tabsOrAccordionSection.editField("title").required(true);
  tabsOrAccordionSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  tabsOrAccordionSection.deleteField("name");
};
