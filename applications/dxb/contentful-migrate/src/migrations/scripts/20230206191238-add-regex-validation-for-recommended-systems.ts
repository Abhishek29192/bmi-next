import type { MigrationFunction } from "contentful-migration";

export const description = "Add regex validation to recommendedSystems field";

export const up: MigrationFunction = (migration) => {
  const systemConfiguratorResult = migration.editContentType(
    "systemConfiguratorResult"
  );

  systemConfiguratorResult.editField("recommendedSystems", {
    type: "Array",
    items: {
      type: "Symbol",
      validations: [{ regexp: { pattern: "^\\S.{0,}\\S$" } }]
    }
  });
};

export const down: MigrationFunction = (migration) => {
  const systemConfiguratorResult = migration.editContentType(
    "systemConfiguratorResult"
  );

  systemConfiguratorResult.editField("recommendedSystems", {
    type: "Array",
    items: {
      type: "Symbol",
      validations: []
    }
  });
};
