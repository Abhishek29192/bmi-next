module.exports.description = "Add Missing Page Types to Site Page Validation";

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
            "productListerPage",
            "documentLibraryPage",
            "brandLandingPage"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};
