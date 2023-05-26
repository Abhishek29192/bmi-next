import type { MigrationFunction } from "contentful-migration";

export const description = "Add Product Lister Page reference to HomePage";

export const up: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("slides", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "promo",
            "page",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("slides", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["contactUsPage", "promo", "page"]
        }
      ],
      linkType: "Entry"
    }
  });
};
