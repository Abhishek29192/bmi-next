import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add lead block to homepage sections field";

const homePageLinkContentType = [
  "cardCollectionSection",
  "carouselSection",
  "villainSection",
  "promo",
  "titleWithContent",
  "serviceLocatorSection",
  "iframe",
  "videoSection",
  "signupBlock"
];

export const up: MigrationFunction = (migration: Migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...homePageLinkContentType, "leadBlockSection"]
        }
      ],
      linkType: "Entry"
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [{ linkContentType: [...homePageLinkContentType] }],
      linkType: "Entry"
    }
  });
};
