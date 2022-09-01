import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Removing unique property. Unique functionality now in UI Extension";

const CT_WITH_SLUG = [
  "page",
  "contactUsPage",
  "productListerPage",
  "documentLibraryPage",
  "brandLandingPage"
];

export const up: MigrationFunction = (migration: Migration) => {
  CT_WITH_SLUG.forEach((ct) => {
    const contentType = migration.editContentType(ct);

    const validations: any = [{ unique: false }];

    contentType.editField("slug").validations(validations);
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  CT_WITH_SLUG.forEach((ct) => {
    const contentType = migration.editContentType(ct);

    contentType.editField("slug").validations([{ unique: true }]);
  });
};
