module.exports.description =
  "Add service locator section to homepage sections field";

module.exports.up = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
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

module.exports.down = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "carouselSection",
            "villainSection",
            "promo",
            "titleWithContent"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};
