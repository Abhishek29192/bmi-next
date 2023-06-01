import type { MigrationFunction } from "contentful-migration";

export const description = "Trim recommended systems";

export const up: MigrationFunction = (migration) => {
  migration.transformEntries({
    contentType: "systemConfiguratorResult",
    from: ["recommendedSystems"],
    to: ["recommendedSystems"],
    shouldPublish: "preserve",
    transformEntryForLocale: (fromFields, currentLocale) => {
      const transformedSystems = (
        fromFields.recommendedSystems?.[currentLocale] || []
      ).map((value: string) => value.trim());

      return { recommendedSystems: transformedSystems };
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const down: MigrationFunction = () => {};
