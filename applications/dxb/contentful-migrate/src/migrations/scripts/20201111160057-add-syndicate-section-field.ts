import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add syndicate section to homepage sections field";

export const up: MigrationFunction = (migration: Migration) => {
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
            "villainSection"
          ]
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
      validations: [
        { linkContentType: ["cardCollectionSection", "carouselSection"] }
      ],
      linkType: "Entry"
    }
  });
};
