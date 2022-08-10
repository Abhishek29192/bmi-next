module.exports.description = "Add video section to homepage sections field";

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
            "serviceLocatorSection",
            "iframe",
            "videoSection"
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