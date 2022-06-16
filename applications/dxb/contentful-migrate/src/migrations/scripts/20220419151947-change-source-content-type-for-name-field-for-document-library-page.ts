import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Copy title to name field for document library page";
const titleNotFound = "Untitled";

export const up: MigrationFunction = (migration: Migration) => {
  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => {
      if (!title) {
        return {
          name: titleNotFound,
          title: titleNotFound
        };
      }
      return {
        name: title[currentLocale].replace(/\|/gi, ""),
        title: title[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["name", "title"],
    to: ["title"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ name, title }, currentLocale) => {
      if (title[currentLocale]) {
        return {
          name: title[currentLocale].replace(/\|/gi, "")
        };
      }
      if (!name) {
        return {
          name: titleNotFound,
          title: titleNotFound
        };
      }
      return {
        title: name[currentLocale],
        name: name[currentLocale]
      };
    }
  });
};
