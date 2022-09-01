import { isDryRun } from "@bmi-digital/contentful-migration";
import { EntryProps, SysLink } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Migrate otherAreas to tabsOrAccordionSection";

export const up: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "contactUsPage",
    from: ["sections", "otherAreas", "otherAreasTitle"],
    to: ["sections"],
    shouldPublish: "preserve",
    transformEntryForLocale: async (
      { otherAreas, otherAreasTitle = null, sections },
      currentLocale
    ) => {
      if (!(otherAreas && otherAreas[currentLocale])) {
        return;
      }

      const existingSections =
        sections && sections[currentLocale] ? sections[currentLocale] : [];

      // Create
      const tabsOrAccordionSection: EntryProps = await context!.makeRequest({
        method: "POST",
        url: "/entries",
        data: JSON.stringify({
          fields: {
            name: otherAreasTitle || { [currentLocale]: "Other areas" },
            title: otherAreasTitle,
            items: otherAreas,
            type: { [currentLocale]: "Accordion" }
          }
        }),
        headers: {
          "X-Contentful-Content-Type": "tabsOrAccordionSection"
        }
      });

      // Publish
      await context!.makeRequest({
        method: "PUT",
        url: `/entries/${tabsOrAccordionSection.sys.id}/published`,
        headers: {
          "X-Contentful-Version": tabsOrAccordionSection.sys.version
        }
      });

      // Cannot remove the Other Sections here because it is a required field.
      return {
        sections: [
          ...existingSections,
          {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: tabsOrAccordionSection.sys.id
            }
          }
        ]
      };
    }
  });
};

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  if (isDryRun) {
    return;
  }

  migration.transformEntries({
    contentType: "contactUsPage",
    from: ["sections"],
    to: ["sections"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ sections }, currentLocale) => {
      if (!(sections && sections[currentLocale])) {
        return;
      }

      const tabsOrAccordionSectionIds = await Promise.all(
        sections[currentLocale].map(async (current: SysLink) => {
          try {
            const section: EntryProps = await context!.makeRequest({
              method: "GET",
              url: `entries/${current.sys.id}`
            });

            if (section.sys.contentType.sys.id === "tabsOrAccordionSection") {
              return current.sys.id;
            }
          } catch (error) {
            // This is happening with sections that are deleted but still
            // attached to the parent.
            return undefined;
          }
        })
      );

      const newSections = sections[currentLocale].filter(
        (section: SysLink) =>
          !tabsOrAccordionSectionIds.includes(section.sys.id)
      );

      return {
        sections: newSections
      };
    }
  });
};
