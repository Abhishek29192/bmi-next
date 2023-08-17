import type { MigrationFunction } from "contentful-migration";

export const description =
  "Update description field on brand landing page to have maximum of 5000 characters";

export const up: MigrationFunction = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage
    .editField("description")
    .validations([{ size: { max: 50000 } }]);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const down: MigrationFunction = (migration) => {};
