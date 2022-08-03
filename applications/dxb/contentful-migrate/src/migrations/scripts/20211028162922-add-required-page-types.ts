import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Missing Page Types to Site Page Validation";

export const up: MigrationFunction = (migration: Migration) => {
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
