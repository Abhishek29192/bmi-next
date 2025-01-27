import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Product Lister Page reference to CardCollectionSection";

export const up: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page", "productListerPage"]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page"]
        }
      ],
      linkType: "Entry"
    }
  });
};
