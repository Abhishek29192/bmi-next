import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import {
  internalName,
  optionalTitle
} from "../../variables/helpText/20210421160910";

export const description = "Add required name field";

export const up: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  syndicateSection.displayField("name");
  syndicateSection.moveField("name").beforeField("title");
  syndicateSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  syndicateSection.editField("title").required(false);
  syndicateSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "villainSection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.displayField("title");
  syndicateSection.editField("title").required(true);
  syndicateSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  syndicateSection.deleteField("name");
};
