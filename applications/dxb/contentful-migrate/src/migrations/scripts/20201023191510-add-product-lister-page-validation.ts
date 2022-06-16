import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Product Lister Page reference to VillainSection";

export const up: MigrationFunction = (migration: Migration) => {
  const villainSection = migration.editContentType("villainSection");

  villainSection.editField("promo", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "promo", "page", "productListerPage"]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const villainSection = migration.editContentType("villainSection");

  villainSection.editField("promo", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "promo", "page"]
      }
    ],
    linkType: "Entry"
  });
};
