import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Update Category Codes field on Document Library Page";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("categoryCodes")
    .name("Category Codes")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });
  documentLibraryPage.moveField("categoryCodes").afterField("assetTypes");
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("categoryCodes");
};
