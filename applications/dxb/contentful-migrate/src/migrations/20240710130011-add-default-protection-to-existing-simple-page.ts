import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add a default value of false to the protection of all simple pages";

export const up: MigrationFunction = async (migration) => {
  migration.transformEntries({
    contentType: "page",
    from: ["isSimplePageProtected"],
    to: ["isSimplePageProtected"],
    transformEntryForLocale: (fromFields, currentLocale) => {
      const currentProtectedPage = (fromFields.isSimplePageProtected || {})[
        currentLocale
      ];
      return { isSimplePageProtected: currentProtectedPage || false };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = async () => {};
