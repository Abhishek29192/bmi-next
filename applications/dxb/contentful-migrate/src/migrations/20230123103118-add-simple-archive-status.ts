import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Simple Archive table type to document library page";

export const up: MigrationFunction = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage
    .editField("resultsType")
    .validations([
      { in: ["Simple", "Simple Archive", "Technical", "Card Collection"] }
    ]);

  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText:
      "Select an appropriate Results Type based on the Source. PIM: Select simple or simple archive or technical. CMS: Select simple or cards. ALL: Select simple or simple archive"
  });
};

export const down: MigrationFunction = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage
    .editField("resultsType")
    .validations([{ in: ["Simple", "Technical", "Card Collection"] }]);

  documentLibraryPage.changeFieldControl("resultsType", "builtin", "dropdown", {
    helpText:
      "Select an appropriate Results Type based on the Source. PIM: Select simple or technical. CMS: Select simple or cards. ALL: Select only simple"
  });
};
