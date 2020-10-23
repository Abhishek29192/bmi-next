module.exports.description = "Create content model for Product Lister Page";

module.exports.up = (migration) => {
  const productListerPage = migration
    .createContentType("productListerPage")
    .name("Product Lister Page")
    .displayField("title")
    .description(
      "This page shows a list of products for a specific PIM category"
    );

  productListerPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  productListerPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  productListerPage
    .createField("categoryCode")
    .name("Category Code")
    .type("Symbol")
    .required(true);

  productListerPage
    .createField("brandLogo")
    .name("Brand Logo")
    .type("Symbol")
    .validations([
      { in: ["Icopal", "Zanda", "Monier", "Monarplan", "AeroDek"] }
    ]);

  productListerPage
    .createField("featuredImage")
    .name("Featured Image")
    .type("Link")
    .linkType("Asset");

  productListerPage.createField("subtitle").name("Subtitle").type("Symbol");

  productListerPage
    .createField("content")
    .name("Content")
    .type("RichText")
    .required(true)
    .validations([
      {
        enabledNodeTypes: [
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "hyperlink"
        ],
        message:
          "Only heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, and link to Url nodes are allowed"
      },
      {
        nodes: {
          "embedded-entry-inline": [{ linkContentType: ["link"] }]
        }
      }
    ]);

  productListerPage
    .createField("features")
    .name("Features")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });

  productListerPage
    .createField("featuresLink")
    .name("Features Link")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  productListerPage
    .createField("exploreBar")
    .name("Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  productListerPage
    .createField("showSignUpBanner")
    .name("Show Sign Up Banner")
    .type("Boolean");

  productListerPage.changeFieldControl("title", "builtin", "singleLine");
  productListerPage.changeFieldControl(
    "slug",
    "builtin",
    "4CKq0CMT3K3rfsDpKSxhdn",
    {
      helpText:
        'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
    }
  );
  productListerPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor"
  );
  productListerPage.changeFieldControl("subtitle", "builtin", "singleLine");
  productListerPage.changeFieldControl("content", "builtin", "richTextEditor");
  productListerPage.changeFieldControl(
    "featuresLink",
    "builtin",
    "entryLinkEditor"
  );
  productListerPage.changeFieldControl(
    "exploreBar",
    "builtin",
    "entryLinkEditor"
  );
  productListerPage.changeFieldControl(
    "showSignUpBanner",
    "builtin",
    "boolean"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("productListerPage");
