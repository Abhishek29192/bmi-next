import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import { internalName } from "../../variables/helpText/20210421160910";

export const description = "Add name field for document library page";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  documentLibraryPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  documentLibraryPage.displayField("name");
  documentLibraryPage.moveField("name").beforeField("title");

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
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.deleteField("name");
  documentLibraryPage.displayField("title");
};
