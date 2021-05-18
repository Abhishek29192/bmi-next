"use strict";

const getFieldValidations = require("../../../../utils/getFieldValidations");
const { isDryRun } = require("../../../../utils/process");

module.exports.description = "Move explore bar to section";

module.exports.up = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...getItemsValidations(), "navigation"]
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

module.exports.down = async (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  const { getItemsValidations } = await getFieldValidations(
    makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: getItemsValidations().filter(
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
        sections[currentLocale].map(async (current) => {
          try {
            const section = await makeRequest({
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
          (section) => section.sys.id !== exploreBarSection.sys.id
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
