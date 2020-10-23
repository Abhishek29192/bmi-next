module.exports.description =
  "Add Product Lister Page reference to VillainSection";

module.exports.up = (migration) => {
  const villainSection = migration.editContentType("villainSection");

  villainSection.editField("promo", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "promo", "page", "productListerPage"]
      }
    ],
    linkType: "Entry"
  });
};

module.exports.down = (migration) => {
  const villainSection = migration.editContentType("villainSection");

  villainSection.editField("promo", {
    type: "Link",
    validations: [
      {
        linkContentType: ["contactUsPage", "promo", "page"]
      }
    ],
    linkType: "Entry"
  });
};
