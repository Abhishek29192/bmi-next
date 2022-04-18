"use strict";

const homePageLinkContentType = [
  "cardCollectionSection",
  "carouselSection",
  "villainSection",
  "promo",
  "titleWithContent",
  "serviceLocatorSection",
  "iframe",
  "videoSection"
];
const contactUsPageLinkContentType = [
  "cardCollectionSection",
  "serviceLocatorSection",
  "tabsOrAccordionSection"
];
const brandLandingPageLinkContentType = [
  "cardCollectionSection",
  "carouselSection",
  "villainSection",
  "titleWithContent"
];
const simplePageLinkContentType = [
  "cardCollectionSection",
  "carouselSection",
  "documentDownloadSection",
  "form",
  "iframe",
  "imageGallerySection",
  "navigation",
  "promo",
  "sampleBasket",
  "serviceLocatorSection",
  "shareWidgetSection",
  "teamSection",
  "villainSection",
  "systemConfiguratorBlock",
  "tabsOrAccordionSection",
  "titleWithContent",
  "twoColumnSection",
  "videoSection"
];
const pageContentTypes = [
  "page",
  "homePage",
  "teamPage",
  "contactUsPage",
  "productListerPage",
  "resources",
  "documentLibraryPage",
  "brandLandingPage"
];

module.exports.description =
  "Link signup block entity for the following pages: " +
  pageContentTypes.join(", ") +
  "and to homepage, brandLandingPage, contactUspage and simple page sections field";

module.exports.up = async (migration, { makeRequest }) => {
  const homePage = migration.editContentType("homePage");
  const brandLandingPage = migration.editContentType("brandLandingPage");
  const contactUsPage = migration.editContentType("contactUsPage");
  const page = migration.editContentType("page");

  contactUsPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...contactUsPageLinkContentType, "signupBlock"]
        }
      ],
      linkType: "Entry"
    }
  });
  brandLandingPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...brandLandingPageLinkContentType, "signupBlock"]
        }
      ],
      linkType: "Entry"
    }
  });
  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...simplePageLinkContentType, "signupBlock"]
      }
    ],
    linkType: "Entry"
  });
  homePage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...homePageLinkContentType, "signupBlock"]
        }
      ],
      linkType: "Entry"
    }
  });
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    if (contentType === "resources") {
      currentContentType
        .createField("pdpSignupBlock")
        .name("PDP: signup block")
        .type("Link")
        .validations([{ linkContentType: ["signupBlock"] }])
        .linkType("Entry");
      currentContentType.changeFieldControl(
        "pdpSignupBlock",
        "builtin",
        "entryLinkEditor"
      );
    } else {
      currentContentType
        .createField("signupBlock")
        .name("Signup Block")
        .type("Link")
        .validations([{ linkContentType: ["signupBlock"] }])
        .linkType("Entry");
      currentContentType.changeFieldControl(
        "signupBlock",
        "builtin",
        "entryLinkEditor"
      );
    }
  });
};

module.exports.down = (migration) => {
  const homePage = migration.editContentType("homePage");
  const brandLandingPage = migration.editContentType("brandLandingPage");
  const contactUsPage = migration.editContentType("contactUsPage");
  const page = migration.editContentType("page");

  contactUsPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...contactUsPageLinkContentType]
        }
      ],
      linkType: "Entry"
    }
  });

  brandLandingPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...brandLandingPageLinkContentType]
        }
      ],
      linkType: "Entry"
    }
  });

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...brandLandingPageLinkContentType]
      }
    ],
    linkType: "Entry"
  });

  homePage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [...homePageLinkContentType]
        }
      ],
      linkType: "Entry"
    }
  });
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    if (contentType === "resources") {
      currentContentType.deleteField("pdpSignupBlock");
    } else {
      currentContentType.deleteField("signupBlock");
    }
  });
};
