import { BLOCKS } from "@contentful/rich-text-types";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { DataTypeEnum } from "../../../components/link/types";
import { Data as SignUpBlockData } from "../../../components/SignupBlock";
import { SourceType } from "../../../components/types/FormSectionTypes";
import { PageContextType } from "../../productListerPage/components/product-lister-page";
import createRichText from "../../../__tests__/helpers/RichTextHelper";
import type { Data as PromoData } from "../../../components/Promo";
import type { Data as CookiePolicyPageData } from "../components/cookie-policy-page";
import type { Data as LeadBlockData } from "../../../components/LeadBlockSection";
import type { Data as LinkData } from "../../../components/link/types";

export const pageContext: PageContextType = {
  allowFilterBy: [],
  variantCode: "variant1",
  siteId: "siteId",
  countryCode: "no",
  categoryCodes: ["category-code-1"],
  variantCodeToPathMap: {
    variant1: "variant1"
  }
};

export const nextBestActions: PromoData[] = [
  {
    __typename: "Promo",
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
export const sections: CookiePolicyPageData["sections"] = [
  {
    __typename: "CardCollectionSection",
    title: "Contentful CardCollection Section Title",
    description: createRichText({
      json: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: "Contentful Card Collection Section Text",
                nodeType: "text"
              }
            ],
            nodeType: BLOCKS.PARAGRAPH
          },
          {
            data: {},
            content: [{ data: {}, marks: [], value: "", nodeType: "text" }],
            nodeType: BLOCKS.PARAGRAPH
          }
        ],
        nodeType: BLOCKS.DOCUMENT
      }
    }),
    cardType: "Highlight Card",
    cardLabel: "Testing",
    groupCards: true,
    link: null,
    sortOrder: null,
    cards: [
      {
        __typename: "Promo",
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
          __typename: "Video",
          title: "BMI Group - We see further",
          label: "BMI Group VIDEO LABEL",
          subtitle:
            "BMI Group - The beginning of a new era in the roofing and waterproofing industry.",
          videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
          previewMedia: null,
          videoRatio: { width: 17776, height: 9999 },
          defaultYouTubePreviewImage:
            "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg",
          className: null
        },
        backgroundColor: null
      }
    ],
    justifyCenter: null,
    displaySingleRow: null
  }
];
export const featuredMedia = createImageData();

export const leadBlockData: LeadBlockData = {
  __typename: "LeadBlockSection",
  title: "ContentfulLeadBlockSectionTitle",
  text: createRichText({
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            { nodeType: "text", value: "test rich text", marks: [], data: {} }
          ],
          data: {}
        }
      ]
    }
  }),
  link: null,
  postItCard: null
};

export const cta: LinkData = {
  __typename: "Link",
  id: "ctaId",
  label: "ctaLabel",
  icon: null,
  isLabelHidden: null,
  url: "https://www.external.co.uk",
  linkedPage: null,
  type: DataTypeEnum.External,
  parameters: null,
  dialogContent: null,
  hubSpotCTAID: null,
  queryParams: null
};

export const signupBlock: SignUpBlockData = {
  __typename: "SignupBlock",
  title: "signupBlockTitle",
  signUpBlockDescription: "description",
  signupLabel: "submitButtonLabel",
  signupDialogContent: {
    __typename: "Form",
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
    source: SourceType.Contentful
  }
};
