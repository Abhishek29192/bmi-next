"use strict";

const icons = require("../../variables/icons/20201111103444").brands;

module.exports.description = "Create content type for Brand Panding Page";

module.exports.up = (migration) => {
  const brandLandingPage = migration
    .createContentType("brandLandingPage")
    .name("Brand Landing Page")
    .displayField("title")
    .description("");

  brandLandingPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  brandLandingPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .validations([{ unique: true }])
    .required(true);

  brandLandingPage
    .createField("subtitle")
    .name("Description")
    .type("Symbol")
    .required(true);

  brandLandingPage
    .createField("brandLogo")
    .name("Brand Logo")
    .type("Symbol")
    .validations([{ in: icons }]);

  brandLandingPage
    .createField("featuredImage")
    .name("Featured Image")
    .type("Link")
    .linkType("Asset")
    .required(true);

  brandLandingPage
    .createField("slides")
    .name("Slides")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "contactUsPage",
            "promo",
            "page",
            "productListerPage"
          ]
        }
      ],
      linkType: "Entry"
    });

  brandLandingPage
    .createField("overlapCards")
    .name("Overlap Cards")
    .type("Array")
    .validations([{ size: { min: 2, max: 4 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactUsPage", "page"] }],
      linkType: "Entry"
    });

  brandLandingPage
    .createField("sections")
    .name("Sections")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [
        { linkContentType: ["carouselSection", "cardCollectionSection"] }
      ],
      linkType: "Entry"
    });

  brandLandingPage
    .createField("inputBanner")
    .name("Input Banner")
    .type("Link")
    .validations([{ linkContentType: ["inputBanner"] }])
    .linkType("Entry");

  brandLandingPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");

  brandLandingPage.changeFieldControl("title", "builtin", "singleLine");
  brandLandingPage.changeFieldControl(
    "featuredImage",
    "builtin",
    "assetLinkEditor"
  );
  brandLandingPage.changeFieldControl("slides", "builtin", "entryLinksEditor");
  brandLandingPage.changeFieldControl(
    "overlapCards",
    "builtin",
    "entryLinksEditor"
  );
  brandLandingPage.changeFieldControl(
    "sections",
    "builtin",
    "entryLinksEditor"
  );
};

module.exports.down = (migration) =>
  migration.deleteContentType("brandLandingPage");
