import type { MigrationFunction } from "contentful-migration";

export const description =
  "Remove team page field from brandLandingPage parentPage.";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page.editField("parentPage").validations([
    {
      linkContentType: [
        "page",
        "contactUsPage",
        "homePage",
        "productListerPage",
        "documentLibraryPage",
        "brandLandingPage"
      ]
    }
  ]);
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page.editField("parentPage").validations([
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
  ]);
};
