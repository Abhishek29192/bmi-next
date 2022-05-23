import { PageContextType } from "../../productListerPage/components/product-lister-page";
import { DataTypeEnum } from "../../../components/Link";

import { ImageWithThumbnail } from "../../../components/PageInfo";
import { Data as SignUpBlockData } from "../../../components/SignupBlock";

export const pageContext: PageContextType = {
  allowFilterBy: [],
  variantCode: "variant1",
  siteId: "siteId",
  countryCode: "no",
  categoryCodes: ["category-code-1"],
  pimClassificationCatalogueNamespace: "",
  variantCodeToPathMap: {
    variant1: "variant1"
  }
};

export const nextBestActions = [
  {
    __typename: "ContentfulPromo",
    id: "nextBestActionsId",
    name: "Action 1",
    title: "Action 1",
    subtitle: null,
    body: null,
    brandLogo: null,
    tags: null,
    featuredMedia: null,
    cta: null,
    featuredVideo: null,
    backgroundColor: null
  }
];
export const sections = [
  {
    __typename: "ContentfulCardCollectionSection",
    title: "ContentfulCardCollectionSectionTitle",
    description: {
      raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"ContentfulCardCollectionSectionText","nodeType":"text"}],"nodeType":"paragraph"},{"data":{},"content":[{"data":{},"marks":[],"value":"","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
      references: []
    },
    cardType: "Highlight Card",
    cardLabel: "Testing",
    groupCards: true,
    link: null,
    sortOrder: null,
    cards: [
      {
        __typename: "ContentfulPromo",
        id: "id",
        name: "BMI test video on PROMO",
        title: "BMI test video on PROMO",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: {
          __typename: "ContentfulVideo",
          title: "BMI Group - We see further",
          label: "BMI Group VIDEO LABEL",
          subtitle:
            "BMI Group - The beginning of a new era in the roofing and waterproofing industry.",
          youtubeId: "TDNEwZbm_Nk",
          previewMedia: null,
          videoRatio: { width: 17776, height: 9999 },
          className: null
        },
        backgroundColor: null
      }
    ],
    justifyCenter: null,
    displaySingleRow: null
  }
];
export const featuredMedia: ImageWithThumbnail = {
  __typename: "ContentfulImage",
  type: null,
  altText: "Lorem ipsum",
  caption: null,
  focalPoint: null,
  image: {
    file: {
      fileName: "Lorem ipsum",
      url: "//images.asset.jpg"
    }
  },
  thumbnail: {
    src: "//images.asset.jpg",
    file: {
      fileName: "Lorem ipsum",
      url: "//images.asset.jpg"
    }
  }
};

export const leadBlockData = {
  __typename: "ContentfulLeadBlockSection",
  title: "ContentfulLeadBlockSectionTitle",
  text: {
    raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
    references: null
  },
  link: null,
  postItCard: null
};

export const shareWidgetData = {
  __typename: "ShareWidgetSection",
  title: "ShareWidgetSectionTitle",
  message: "ShareWidgetSectionMessage",
  clipboardSuccessMessage: null,
  clipboardErrorMessage: null,
  isLeftAligned: null,
  copy: null,
  email: null,
  facebook: null,
  linkedin: null,
  pinterest: null,
  twitter: null
};

export const exploreBarData = {
  label: "exploreBarDataLabel",
  links: []
};

export const linkColumnsData = {
  __typename: "ContentfulLink",
  title: "linkColumnsTitle",
  columns: [
    {
      __typename: "ContentfulNavigation",
      label: "Link column title",
      link: null,
      links: [{ type: "Heading", value: "Link column value" }]
    }
  ]
};

export const cta = {
  __typename: "ContentfulLink",
  id: "ctaId",
  label: "ctaLabel",
  icon: null,
  isLabelHidden: null,
  url: "https://www.external.co.uk",
  linkedPage: null,
  type: DataTypeEnum.External,
  parameters: null,
  dialogContent: null,
  hubSpotCTAID: null
};

export const signupBlock: SignUpBlockData = {
  __typename: "ContentfulSignupBlock",
  title: "signupBlockTitle",
  description: { description: "description" },
  signupLabel: "submitButtonLabel",
  signupDialogContent: {
    __typename: "ContentfulFormSection",
    title: "Test form",
    showTitle: null,
    description: null,
    recipients: "recipient@mail.com",
    inputs: [
      {
        label: "Email",
        name: "email",
        required: true,
        type: "email",
        width: "half"
      }
    ],
    submitText: "signmeup",
    successRedirect: null,
    source: null
  }
};
