import {
  internalName,
  optionalTitle
} from "../../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add required name field";

export const up: MigrationFunction = (migration) => {
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

export const down: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.displayField("title");
  cardCollectionSection.deleteField("name");
};
