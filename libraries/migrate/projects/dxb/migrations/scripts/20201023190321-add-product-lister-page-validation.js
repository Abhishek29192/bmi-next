module.exports.description = "Add Product Lister Page reference to Link";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");

  link.editField("linkedPage", {
    type: "Link",
    validations: [
      {
        linkContentType: [
          "contactUsPage",
          "page",
          "teamPage",
          "productListerPage"
        ]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");

  link.editField("linkedPage", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "page", "teamPage"]
      }
    ],
    linkType: "Entry"
  });
};
