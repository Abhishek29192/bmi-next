module.exports.description = "Create content model for Simple Page";

module.exports.up = (migration) => {
  const page = migration
    .createContentType("page")
    .name("Simple Page")
    .displayField("title")
    .description("This page can contain any content");

  page
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField("featuredImage")
    .name("Featured Image")
    .type("Link")
    .linkType("Asset");

  page.createField("subtitle").name("Subtitle").type("Symbol");

  page
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "form",
            "leadBlockSection",
            "pageLinksSection",
            "tabsOrAccordionSection",
            "twoColumnSection",
            "villainSection"
          ]
        }
      ],
      linkType: "Entry"
    });

  page
    .createField("exploreBar")
    .name("Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  page
    .createField("showSignUpBanner")
    .name("Show Sign Up Banner")
    .type("Boolean");

  page.changeFieldControl("title", "builtin", "singleLine");
  page.changeFieldControl("slug", "builtin", "4CKq0CMT3K3rfsDpKSxhdn", {
    helpText:
      'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
  });
  page.changeFieldControl("featuredImage", "builtin", "assetLinkEditor");
  page.changeFieldControl("subtitle", "builtin", "singleLine");
  page.changeFieldControl("sections", "builtin", "entryLinksEditor");
  page.changeFieldControl("exploreBar", "builtin", "entryLinkEditor");
  page.changeFieldControl("showSignUpBanner", "builtin", "boolean");
};

module.exports.down = (migration) => migration.deleteContentType("page");
