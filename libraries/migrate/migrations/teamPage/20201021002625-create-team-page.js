module.exports.description = "Create content model for Team Page";

module.exports.up = (migration) => {
  const teamPage = migration
    .createContentType("teamPage")
    .name("Team Page")
    .displayField("title")
    .description("");

  teamPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  teamPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  teamPage.createField("subtitle").name("Subtitle").type("Symbol");

  teamPage
    .createField("featuredImage")
    .name("Featured Image")
    .type("Link")
    .required(true)
    .linkType("Asset");

  teamPage
    .createField("teamCategories")
    .name("Team categories")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["teamCategory"] }],
      linkType: "Entry"
    });

  teamPage
    .createField("showSignUpBanner")
    .name("Show Sign Up Banner")
    .type("Boolean");

  teamPage.createField("hideFooter").name("Hide Footer").type("Boolean");

  teamPage.changeFieldControl("title", "builtin", "singleLine");
  teamPage.changeFieldControl("slug", "builtin", "4CKq0CMT3K3rfsDpKSxhdn", {
    helpText:
      'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
  });
  teamPage.changeFieldControl("subtitle", "builtin", "singleLine");
  teamPage.changeFieldControl("featuredImage", "builtin", "assetLinkEditor");
  teamPage.changeFieldControl("teamCategories", "builtin", "entryLinksEditor");
  teamPage.changeFieldControl("showSignUpBanner", "builtin", "boolean");
  teamPage.changeFieldControl("hideFooter", "builtin", "boolean");
};

module.exports.down = (migration) => migration.deleteContentType("teamPage");
