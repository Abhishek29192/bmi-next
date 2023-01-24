import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Update description field on brand landing page to have maximum of 400 characters";

export const up: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  migration.transformEntries({
    contentType: "brandLandingPage",
    from: ["description"],
    to: ["description"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ description }, currentLocale) => {
      if (!description) {
        return;
      }
      return {
        description:
          description[currentLocale].length <= 400
            ? description[currentLocale]
            : description[currentLocale].slice(0, 400)
      };
    }
  });
  brandLandingPage
    .editField("description")
    .validations([{ size: { max: 400 } }]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage
    .editField("description")
    .validations([{ size: { max: 50000 } }]);
};
