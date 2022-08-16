import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add tags field to brand landing page content type with entries";

export const up: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage
    .createField("tags")
    .name("Tags")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["tag"]
        }
      ],
      linkType: "Entry"
    });

  brandLandingPage.changeFieldControl("tags", "builtin", "entryCardsEditor", {
    helpText: "Please add tags to group content or specify the type of page"
  });

  brandLandingPage.moveField("tags").afterField("tag");

  migration.transformEntries({
    contentType: "brandLandingPage",
    from: ["tag"],
    to: ["tags"],
    transformEntryForLocale: async ({ tag }, currentLocale) => {
      if (!tag) {
        return;
      }

      return {
        tags: [tag[currentLocale]]
      };
    }
  });

  // For safety, task to remove the `tag` field tracked by:
  // https://bmigroup.atlassian.net/browse/DXB-1409
  brandLandingPage.editField("tag").disabled(true).omitted(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage.editField("tag").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "brandLandingPage",
    from: ["tags"],
    to: ["tag"],
    transformEntryForLocale: async ({ tag }, currentLocale) => {
      if (!tag) {
        return;
      }

      return {
        tag: tag[currentLocale]
      };
    }
  });

  brandLandingPage.deleteField("tags");
};
