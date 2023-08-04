import type { MigrationFunction } from "contentful-migration";

export const description =
  "Delete tag field from document library page content type";

export const up: MigrationFunction = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.deleteField("tag");
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
