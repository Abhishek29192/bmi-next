import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add search page next best actions (nba) to resources content type";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageNextBestActions")
    .name("Search Page: Next Best Actions")
    .type("Array")
    .validations([{ size: { max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "promo",
            "page",
            "productListerPage",
            "contactUsPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageNextBestActions");
};
