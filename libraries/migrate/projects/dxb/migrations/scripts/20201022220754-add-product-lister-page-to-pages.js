module.exports.description = "Add Product Lister Page to pages";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.editField("pages", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "homePage",
            "page",
            "teamPage",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.editField("pages", {
    items: {
      type: "Link",
      validations: [
        { linkContentType: ["contactUsPage", "homePage", "page", "teamPage"] }
      ],
      linkType: "Entry"
    }
  });
};
