import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add next best actions field to contact us page";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("nextBestActions")
    .name("Next best actions")
    .type("Array")
    .validations([{ size: { min: 2, max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page", "productListerPage", "teamPage"]
        }
      ],
      linkType: "Entry"
    });
  contactUsPage.changeFieldControl(
    "nextBestActions",
    "builtin",
    "entryLinksEditor"
  );
  contactUsPage.moveField("nextBestActions").afterField("iframe");
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.editContentType("contactUsPage").deleteField("nextBestActions");
};
