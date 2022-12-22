import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add validation for countryNavigationIntroduction(resources)";

export const up: MigrationFunction = (migration: Migration) => {
  const resource = migration.editContentType("resources");

  resource.editField("countryNavigationIntroduction", {
    type: "RichText",
    validations: [{ size: { max: 256 } }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const resource = migration.editContentType("resources");

  resource.editField("countryNavigationIntroduction", {
    type: "RichText",
    validations: []
  });
};
