module.exports.description = "Create content model for Contact Us Page";

module.exports.up = (migration) => {
  const contactUsPage = migration
    .createContentType("contactUsPage")
    .name("Contact Us Page")
    .displayField("title")
    .description("");

  contactUsPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  contactUsPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  contactUsPage.createField("subtitle").name("Subtitle").type("Symbol");

  contactUsPage
    .createField("featuredImage")
    .name("Featured Image")
    .type("Link")
    .required(true)
    .linkType("Asset");

  contactUsPage
    .createField("queriesTitle")
    .name("Queries Title")
    .type("Symbol");

  contactUsPage
    .createField("queriesSubtitle")
    .name("Queries Subtitle")
    .type("Symbol");

  contactUsPage
    .createField("otherAreasTitle")
    .name("Other areas title")
    .type("Symbol");

  contactUsPage
    .createField("otherAreas")
    .name("Other areas")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });

  contactUsPage
    .createField("showSignUpBanner")
    .name("Show Sign Up Banner")
    .type("Boolean");

  contactUsPage.changeFieldControl("title", "builtin", "singleLine");
  contactUsPage.changeFieldControl(
    "slug",
    "builtin",
    "4CKq0CMT3K3rfsDpKSxhdn",
    {
      helpText:
        'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
    }
  );
  contactUsPage.changeFieldControl("subtitle", "builtin", "singleLine");
  contactUsPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor"
  );
  contactUsPage.changeFieldControl("queriesTitle", "builtin", "singleLine");
  contactUsPage.changeFieldControl("queriesSubtitle", "builtin", "singleLine");
  contactUsPage.changeFieldControl("otherAreasTitle", "builtin", "singleLine");
  contactUsPage.changeFieldControl("otherAreas", "builtin", "entryLinksEditor");
  contactUsPage.changeFieldControl("showSignUpBanner", "builtin", "boolean");
};

module.exports.down = (migration) =>
  migration.deleteContentType("contactUsPage");
