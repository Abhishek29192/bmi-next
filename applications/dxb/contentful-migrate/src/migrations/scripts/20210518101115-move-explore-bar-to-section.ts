import {
  getItemsValidations,
  isDryRun
} from "@bmi-digital/contentful-migration";
import type { EntryProps, SysLink } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Move explore bar to section";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...(validation?.linkContentType || []), "navigation"]
      }
    ],
    linkType: "Entry"
  });

  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "page",
    from: ["exploreBar", "sections"],
    to: ["sections"],
    shouldPublish: "preserve",
    transformEntryForLocale: async (
      { exploreBar, sections },
      currentLocale
    ) => {
      if (!(exploreBar && exploreBar[currentLocale])) {
        return;
      }

      const existingSections =
        sections && sections[currentLocale] ? sections[currentLocale] : [];

      return {
        sections: [
          ...existingSections,
          {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: exploreBar[currentLocale].sys.id
            }
          }
        ]
      };
    }
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== "navigation"
        )
      }
    ],
    linkType: "Entry"
  });

  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "page",
    from: ["sections"],
    to: ["exploreBar"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ sections }, currentLocale) => {
      if (!(sections && sections[currentLocale])) {
        return;
      }

      const exploreBarSections = await Promise.all(
        sections[currentLocale].map(async (current: SysLink) => {
          try {
            const section: EntryProps = await context!.makeRequest({
              method: "GET",
              url: `entries/${current.sys.id}`
            });

            if (section.sys.contentType.sys.id === "navigation") {
              return section;
            }
          } catch (error) {
            // This is happening with sections that are deleted but still
            // attached to the parent.
            return undefined;
          }
        })
      );

      // This will only take the last exploreBarSection, since only one can be translated back.
      const exploreBarSection = exploreBarSections.filter(Boolean)[0];

      if (!exploreBarSection) {
        return;
      }

      return {
        sections: sections[currentLocale].filter(
          (section: SysLink) => section.sys.id !== exploreBarSection.sys.id
        ),
        exploreBar: {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: exploreBarSection.sys.id
          }
        }
      };
    }
  });
};
