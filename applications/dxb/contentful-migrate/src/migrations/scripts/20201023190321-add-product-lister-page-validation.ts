import type { MigrationFunction } from "contentful-migration";

export const description = "Add Product Lister Page reference to Link";

export const up: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("linkedPage", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "contactUsPage",
          "page",
          "teamPage",
          "productListerPage"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("linkedPage", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "page", "teamPage"]
      }
    ],
    linkType: "Entry"
  });
};
