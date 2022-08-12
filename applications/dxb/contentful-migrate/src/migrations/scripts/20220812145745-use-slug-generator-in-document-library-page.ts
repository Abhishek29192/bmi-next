import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Change slug control from default to Slug Generator";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.changeFieldControl(
    "slug",
    "builtin",
    "4CKq0CMT3K3rfsDpKSxhdn"
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.resetFieldControl("slug");
};
