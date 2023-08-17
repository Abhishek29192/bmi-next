import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add name field for team section";

export const up: MigrationFunction = (migration) => {
  const teamSection = migration.editContentType("teamSection");
  teamSection.createField("name").name("Name").type("Symbol").required(true);
  teamSection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  teamSection.displayField("name");
  teamSection.moveField("name").beforeField("title");

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
  const teamSection = migration.editContentType("teamSection");
  teamSection.deleteField("name");
  teamSection.displayField("title");
};
