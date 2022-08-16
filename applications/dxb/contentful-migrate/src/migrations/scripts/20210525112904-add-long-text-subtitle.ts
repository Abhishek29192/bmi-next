import { isDryRun } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "change subtitle field from short text to long text";

// This script was split due to limitation/features of contentful migration
// such that you cannot rename/disable field and make a new one with same name in same script
export const up: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");

  page
    .createField("subtitle")
    .name("Subtitle")
    .type("Text")
    .validations([{ size: { max: 400 } }]);

  page.moveField("subtitle").afterField("brandLogo");
  page.changeFieldControl("subtitle", "builtin", "multipleLine");

  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "page",
    from: ["subtitleShortText"],
    to: ["subtitle"],
    transformEntryForLocale: async ({ subtitleShortText }, currentLocale) => {
      if (!subtitleShortText) {
        return;
      }

      return {
        subtitle: subtitleShortText[currentLocale]
      };
    }
  });
};

// Please run "migrate down -e [environment] -c page 20210524130540-rename-subtitle-text-field.js"
// so that it returns the subtitle field back to its previous state
export const down: MigrationFunction = (migration: Migration) => {
  const page = migration.editContentType("page");
  page.deleteField("subtitle");
};
