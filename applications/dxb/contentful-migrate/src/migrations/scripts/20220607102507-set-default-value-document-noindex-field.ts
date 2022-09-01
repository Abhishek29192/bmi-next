import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Set a default value for the noIndex field in the Document content type";

export const up: MigrationFunction = (migration: Migration) => {
  migration.transformEntries({
    contentType: "document",
    from: ["noIndex"],
    to: ["noIndex"],
    transformEntryForLocale: (fromFields) => {
      if (fromFields.noIndex) {
        return;
      }

      return { noIndex: false };
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const down: MigrationFunction = () => {};
