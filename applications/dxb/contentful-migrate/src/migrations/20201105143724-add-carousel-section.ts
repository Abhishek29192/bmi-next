import type { MigrationFunction } from "contentful-migration";

export const description = "Add CarouselSection to page sections";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          "cardCollectionSection",
          "form",
          "leadBlockSection",
          "pageLinksSection",
          "tabsOrAccordionSection",
          "twoColumnSection",
          "villainSection",
          "titleWithContent",
          "shareWidgetSection",
          "carouselSection"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          "cardCollectionSection",
          "form",
          "leadBlockSection",
          "pageLinksSection",
          "tabsOrAccordionSection",
          "twoColumnSection",
          "villainSection",
          "titleWithContent",
          "shareWidgetSection"
        ]
      }
    ],
    linkType: "Entry"
  });
};
