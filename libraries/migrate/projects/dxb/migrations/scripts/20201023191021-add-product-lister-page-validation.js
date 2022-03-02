module.exports.description = "Add Product Lister Page reference to HomePage";

module.exports.up = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.editField("slides", {
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
  const homePage = migration.editContentType("homePage");

  homePage.editField("slides", {
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
