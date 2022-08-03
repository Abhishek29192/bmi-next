import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description = "Add name field for simple page";

export const up: MigrationFunction = (migration: Migration) => {
  const simplePage = migration.editContentType("page");
  simplePage.createField("name").name("Name").type("Symbol").required(true);
  simplePage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  simplePage.displayField("name");
  simplePage.moveField("name").beforeField("title");

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
  const simplePage = migration.editContentType("page");
  simplePage.deleteField("name");
  simplePage.displayField("title");
};
