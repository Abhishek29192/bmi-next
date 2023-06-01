import { internalName } from "../../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add name field for team category";

export const up: MigrationFunction = (migration) => {
  const teamCategory = migration.editContentType("teamCategory");
  teamCategory.createField("name").name("Name").type("Symbol").required(true);
  teamCategory.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  teamCategory.displayField("name");
  teamCategory.moveField("name").beforeField("title");

  migration.transformEntries({
    contentType: "page",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]).replace(/\|/gi, "")
    }),
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration) => {
  const teamCategory = migration.editContentType("teamCategory");
  teamCategory.deleteField("name");
  teamCategory.displayField("title");
};
