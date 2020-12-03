module.exports.description =
  "Create content model for Tabs Or Accordion Section";

module.exports.up = (migration) => {
  const tabsOrAccordionSection = migration
    .createContentType("tabsOrAccordionSection")
    .name("Tabs Or Accordion Section")
    .displayField("title")
    .description("");

  tabsOrAccordionSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  tabsOrAccordionSection
    .createField("description")
    .name("Description")
    .type("Text");

  tabsOrAccordionSection
    .createField("items")
    .name("Items")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });

  tabsOrAccordionSection
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Accordion", "Tabs"] }]);

  tabsOrAccordionSection.changeFieldControl("title", "builtin", "singleLine");
  tabsOrAccordionSection.changeFieldControl(
    "description",
    "builtin",
    "multipleLine"
  );
  tabsOrAccordionSection.changeFieldControl(
    "items",
    "builtin",
    "entryLinksEditor"
  );
  tabsOrAccordionSection.changeFieldControl("type", "builtin", "dropdown");
};

module.exports.down = (migration) =>
  migration.deleteContentType("tabsOrAccordionSection");
