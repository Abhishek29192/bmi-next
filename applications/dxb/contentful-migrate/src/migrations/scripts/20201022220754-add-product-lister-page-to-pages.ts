import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Product Lister Page to pages";

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
            "teamPage",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const site = migration.editContentType("site");

  site.editField("pages", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        { linkContentType: ["contactUsPage", "homePage", "page", "teamPage"] }
      ],
      linkType: "Entry"
    }
  });
};
