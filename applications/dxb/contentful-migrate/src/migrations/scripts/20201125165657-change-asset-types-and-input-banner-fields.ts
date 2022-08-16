import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Change assetTypes and inputBanner fields to not required";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.editField("assetTypes").required(false);
  documentLibraryPage.editField("inputBanner").required(false);
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.editField("assetTypes").required(true);
  documentLibraryPage.editField("inputBanner").required(true);
};
