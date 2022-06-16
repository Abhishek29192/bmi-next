import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add help text to featuredImage field on contactUsPage content type.";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor",
    {
      helpText:
        "Although the Featured Image is not always visible on the page hero, it is good practice to include one whenever possible since that image will be shown as a thumbnail when the page is linked externally."
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor",
    {
      helpText: ""
    }
  );
};
