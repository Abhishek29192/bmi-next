module.exports.description = "Add Product Lister Page reference to HomePage";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");

  link.editField("slides", {
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
  const link = migration.editContentType("link");

  link.editField("slides", {
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
