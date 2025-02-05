import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add System Configurator Section content type to allowed sections on Simple Page";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");
  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          "cardCollectionSection",
          "carouselSection",
          "documentDownloadSection",
          "form",
          "iframe",
          "imageGallerySection",
          "navigation",
          "promo",
          "sampleBasket",
          "serviceLocatorSection",
          "shareWidgetSection",
          "teamSection",
          "villainSection",
          "tabsOrAccordionSection",
          "titleWithContent",
          "twoColumnSection",
          "videoSection",
          "signupBlock",
          "systemConfiguratorBlock",
          "systemConfiguratorSection"
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
          "carouselSection",
          "documentDownloadSection",
          "form",
          "iframe",
          "imageGallerySection",
          "navigation",
          "promo",
          "sampleBasket",
          "serviceLocatorSection",
          "shareWidgetSection",
          "teamSection",
          "villainSection",
          "tabsOrAccordionSection",
          "titleWithContent",
          "twoColumnSection",
          "videoSection",
          "signupBlock",
          "systemConfiguratorBlock"
        ]
      }
    ],
    linkType: "Entry"
  });
};
