import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add next best actions field to page content type";

export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page
    .createField("nextBestActions")
    .name("Next best actions")
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

  page.changeFieldControl("nextBestActions", "builtin", "entryLinksEditor");
  page.moveField("nextBestActions").afterField("sections");
};

export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page.deleteField("nextBestActions");
};
