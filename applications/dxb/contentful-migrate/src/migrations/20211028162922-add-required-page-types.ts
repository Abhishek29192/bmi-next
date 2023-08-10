import type { MigrationFunction } from "contentful-migration";

export const description = "Add Missing Page Types to Site Page Validation";

export const up: MigrationFunction = (migration) => {
  const site = migration.editContentType("site");

  site.editField("pages", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "homePage",
            "page",
            "productListerPage",
            "documentLibraryPage",
            "brandLandingPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration) => {
  // no-op
};
