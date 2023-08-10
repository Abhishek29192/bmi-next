import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add validation for countryNavigationIntroduction(resources)";

export const up: MigrationFunction = (migration) => {
  const resource = migration.editContentType("resources");

  resource.editField("countryNavigationIntroduction", {
    type: "RichText",
    validations: [{ size: { max: 256 } }]
  });
};

export const down: MigrationFunction = (migration) => {
  const resource = migration.editContentType("resources");

  resource.editField("countryNavigationIntroduction", {
    type: "RichText",
    validations: []
  });
};
