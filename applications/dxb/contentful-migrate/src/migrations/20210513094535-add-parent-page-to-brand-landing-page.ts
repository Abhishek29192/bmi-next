import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add parentPage field to brandLandingPage content type.";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page
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

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("brandLandingPage");
  page.deleteField("parentPage");
};
