import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add helpText to resultsType field";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText:
      "Select an appropriate Results Type based on the Source. PIM: Select simple or technical. CMS: Select simple or cards. ALL: Select only simple"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText: ""
  });
};
