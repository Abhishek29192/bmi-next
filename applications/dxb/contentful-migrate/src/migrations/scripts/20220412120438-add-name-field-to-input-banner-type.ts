import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description = "Add name field for input banner type";

export const up: MigrationFunction = (migration: Migration) => {
  const inputBanner = migration.editContentType("inputBanner");
  inputBanner.createField("name").name("Name").type("Symbol").required(true);
  inputBanner.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  inputBanner.displayField("name");
  inputBanner.moveField("name").beforeField("title");

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

export const down: MigrationFunction = (migration: Migration) => {
  const inputBanner = migration.editContentType("document");
  inputBanner.deleteField("name");
  inputBanner.displayField("title");
};
