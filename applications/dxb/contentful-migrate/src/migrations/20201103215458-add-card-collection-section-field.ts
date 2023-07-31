import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add card collection section to homepage sections field";

export const up: MigrationFunction = (migration) => {
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

export const down: MigrationFunction = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    type: "Array",
    items: {
      type: "Link",
      validations: [{ linkContentType: ["carouselSection"] }],
      linkType: "Entry"
    }
  });
};
