module.exports.description =
  "Add Product Lister Page reference to CarouselSection";

module.exports.up = (migration) => {
  const carouselSection = migration.editContentType("carouselSection");

  carouselSection.editField("slides", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "promo",
            "page",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

module.exports.down = (migration) => {
  const carouselSection = migration.editContentType("carouselSection");

  carouselSection.editField("slides", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["contactUsPage", "promo", "page"]
        }
      ],
      linkType: "Entry"
    }
  });
};
