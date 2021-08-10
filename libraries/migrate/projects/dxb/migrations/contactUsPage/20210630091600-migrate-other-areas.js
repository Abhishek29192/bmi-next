"use strict";

const { isDryRun } = require("../../../../utils/process");

module.exports.description = "Migrate otherAreas to tabsOrAccordionSection";

module.exports.up = (migration, { makeRequest }) => {
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
      const tabsOrAccordionSection = await makeRequest({
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
      await makeRequest({
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

module.exports.down = (migration, { makeRequest }) => {
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
        sections[currentLocale].map(async (current) => {
          try {
            const section = await makeRequest({
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
        (section) => !tabsOrAccordionSectionIds.includes(section.sys.id)
      );

      return {
        sections: newSections
      };
    }
  });
};
