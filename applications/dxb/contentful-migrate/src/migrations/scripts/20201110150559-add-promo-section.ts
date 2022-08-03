import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add promo section to simple page content type";

export const up: MigrationFunction = (migration: Migration) => {
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
          "carouselSection",
          "promo"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
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
