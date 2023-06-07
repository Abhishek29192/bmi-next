import type { MigrationFunction } from "contentful-migration";

export const description = "Add parentPage field to teamPage content type.";

export const up: MigrationFunction = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage
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
  const teamPage = migration.editContentType("teamPage");
  teamPage.deleteField("parentPage");
};
