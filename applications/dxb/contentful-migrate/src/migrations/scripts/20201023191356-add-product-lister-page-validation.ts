import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Product Lister Page reference to CarouselSection";

export const up: MigrationFunction = (migration: Migration) => {
  const carouselSection = migration.editContentType("carouselSection");

  carouselSection.editField("slides", {
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

export const down: MigrationFunction = (migration: Migration) => {
  const carouselSection = migration.editContentType("carouselSection");

  carouselSection.editField("slides", {
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
