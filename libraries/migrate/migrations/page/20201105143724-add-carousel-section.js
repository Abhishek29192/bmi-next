"use strict";

module.exports.description = "Add CarouselSection to page sections";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
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
