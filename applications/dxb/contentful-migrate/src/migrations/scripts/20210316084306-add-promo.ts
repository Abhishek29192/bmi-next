import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Promo to Navigation";

export const up: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation
    .createField("promo")
    .name("Promo")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "contactUsPage",
          "promo",
          "page",
          "productListerPage",
          "documentLibraryPage"
        ]
      }
    ])
    .linkType("Entry");

  navigation.changeFieldControl("promo", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration: Migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.deleteField("promo");
};
