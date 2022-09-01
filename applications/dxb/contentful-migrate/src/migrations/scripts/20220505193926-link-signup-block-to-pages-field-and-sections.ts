import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

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
  "contactUsPage",
  "productListerPage",
  "resources",
  "documentLibraryPage",
  "brandLandingPage"
];

export const description =
  "Link signup block entity for the following pages: " +
  pageContentTypes.join(", ") +
  "and to homepage, brandLandingPage, contactUspage and simple page sections field";

export const up: MigrationFunction = async (migration: Migration) => {
  const homePage = migration.editContentType("homePage");
  const brandLandingPage = migration.editContentType("brandLandingPage");
  const contactUsPage = migration.editContentType("contactUsPage");
  const page = migration.editContentType("page");

  contactUsPage.editField("sections", {
    type: "Array",
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
    type: "Array",
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
    type: "Array",
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

export const down: MigrationFunction = (migration: Migration) => {
  const homePage = migration.editContentType("homePage");
  const brandLandingPage = migration.editContentType("brandLandingPage");
  const contactUsPage = migration.editContentType("contactUsPage");
  const page = migration.editContentType("page");

  contactUsPage.editField("sections", {
    type: "Array",
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
    type: "Array",
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
    type: "Array",
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
