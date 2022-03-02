module.exports.description =
  "Add card collection section to homepage sections field";

module.exports.up = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        { linkContentType: ["cardCollectionSection", "carouselSection"] }
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
      validations: [{ linkContentType: ["carouselSection"] }],
      linkType: "Entry"
    }
  });
};
