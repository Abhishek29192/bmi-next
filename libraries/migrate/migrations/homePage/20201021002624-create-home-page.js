module.exports.description = "Create content model for Home Page";

module.exports.up = (migration) => {
  const homePage = migration
    .createContentType("homePage")
    .name("Home Page")
    .displayField("title")
    .description("");

  homePage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  homePage
    .createField("slides")
    .name("Slides")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactUsPage", "promo", "page"] }],
      linkType: "Entry"
    });

  homePage
    .createField("overlapCards")
    .name("Overlap Cards")
    .type("Array")
    .validations([{ size: { min: 2, max: 4 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactUsPage", "page"] }],
      linkType: "Entry"
    });

  homePage
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["carouselSection"] }],
      linkType: "Entry"
    });

  homePage
    .createField("showSignUpBanner")
    .name("Show Sign Up Banner")
    .type("Boolean");

  homePage.changeFieldControl("title", "builtin", "singleLine");
  homePage.changeFieldControl("slides", "builtin", "entryLinksEditor");
  homePage.changeFieldControl("overlapCards", "builtin", "entryLinksEditor");
  homePage.changeFieldControl("sections", "builtin", "entryLinksEditor");
  homePage.changeFieldControl("showSignUpBanner", "builtin", "boolean");
};

module.exports.down = (migration) => migration.deleteContentType("homePage");
