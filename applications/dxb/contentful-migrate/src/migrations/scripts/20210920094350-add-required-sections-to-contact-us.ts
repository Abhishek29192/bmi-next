import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add sections field";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "tabsOrAccordionSection",
            "serviceLocatorSection"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["cardCollectionSection", "tabsOrAccordionSection"]
        }
      ],
      linkType: "Entry"
    }
  });
};
