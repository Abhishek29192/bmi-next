import type { MigrationFunction } from "contentful-migration";

export const description = "Add iframe section to homepage sections field";

export const up: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "carouselSection",
            "villainSection",
            "promo",
            "titleWithContent",
            "serviceLocatorSection",
            "iframe"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "carouselSection",
            "villainSection",
            "promo",
            "titleWithContent",
            "serviceLocatorSection"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};