module.exports.description =
  "Add Product Lister Page reference to CardCollectionSection";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page", "productListerPage"]
        }
      ],
      linkType: "Entry"
    }
  });
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page"]
        }
      ],
      linkType: "Entry"
    }
  });
};
