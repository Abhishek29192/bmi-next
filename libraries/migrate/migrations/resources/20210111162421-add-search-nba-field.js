module.exports.description =
  "Add search page next best actions (nba) to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageNextBestActions")
    .name("Search Page: Next Best Actions")
    .type("Array")
    .validations([{ size: { max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "promo",
            "page",
            "productListerPage",
            "contactUsPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    });
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageNextBestActions");
};
