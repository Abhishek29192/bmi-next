import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Tabs Or Accordion Section";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("tabsOrAccordionSection");
