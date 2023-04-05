import { hyphenSymbol } from "../../variables/hyphenSymbol/20220504110700";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Change hyphen symbol for team section type";

const titleNotFound = "Untitled";

export const up: MigrationFunction = (migration: Migration) => {
  migration.transformEntries({
    contentType: "teamSection",
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
        name: title[currentLocale].replace(hyphenSymbol, ""),
        title: title[currentLocale]
      };
    },
    shouldPublish: "preserve"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.transformEntries({
    contentType: "teamSection",
    from: ["name", "title"],
    to: ["title"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ name, title }, currentLocale) => {
      if (title[currentLocale]) {
        return {
          name: title[currentLocale].replace(hyphenSymbol, "")
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
