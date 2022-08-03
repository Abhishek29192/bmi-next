import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import {
  internalName,
  optionalTitle
} from "../../variables/helpText/20210421160910";

export const description = "Add required name field";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
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
