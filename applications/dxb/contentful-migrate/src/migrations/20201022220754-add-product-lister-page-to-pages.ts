import type { MigrationFunction } from "contentful-migration";

export const description = "Add Product Lister Page to pages";

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
            "teamPage",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration) => {
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
