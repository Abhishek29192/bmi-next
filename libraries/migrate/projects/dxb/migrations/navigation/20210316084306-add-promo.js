module.exports.description = "Add Promo to Navigation";

module.exports.up = (migration) => {
  const navigation = migration.editContentType("navigation");
  navigation
    .createField("promo")
    .name("Promo")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "contactUsPage",
          "promo",
          "page",
          "productListerPage",
          "documentLibraryPage"
        ]
      }
    ])
    .linkType("Entry");

  navigation.changeFieldControl("promo", "builtin", "entryLinkEditor");
};

module.exports.down = (migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.deleteField("promo");
};
