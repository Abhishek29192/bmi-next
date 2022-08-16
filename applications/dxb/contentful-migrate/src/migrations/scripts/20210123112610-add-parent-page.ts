import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add parentPage field to documentLibraryPage content type.";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("parentPage")
    .name("Parent Page")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "page",
          "contactUsPage",
          "teamPage",
          "homePage",
          "productListerPage",
          "documentLibraryPage",
          "brandLandingPage"
        ]
      }
    ])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");
  documentLibraryPage.deleteField("parentPage");
};
