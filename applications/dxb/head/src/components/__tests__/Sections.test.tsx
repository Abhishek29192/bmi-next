import ThemeProvider from "@bmi-digital/components/theme-provider";
import { BLOCKS } from "@contentful/rich-text-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import createGallerySectionImage from "../../__tests__/helpers/GallerySectionImageHelper";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import createService from "../../__tests__/helpers/ServiceHelper";
import { renderWithRouter } from "../../test/renderWithRouter";
import Sections, { Data } from "../Sections";
import { EntryTypeEnum } from "../Service";
import { SiteContextProvider } from "../Site";
import { DataTypeEnum } from "../link/types";
import { SourceType } from "../types/FormSectionTypes";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import { getMockSiteContext } from "./utils/SiteContextProvider";
import type { RichTextData } from "../RichText";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("uk", "en-UK"),
          homePage: { title: "Home Page" },
          getMicroCopy: (path) => path,

          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        {children}
      </SiteContextProvider>
    </ThemeProvider>
  );
};

const contentMock: RichTextData["json"] = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

describe("Sections component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            name: "hello",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Accordion"
      },
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            name: "hello",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Tabs"
      },
      {
        __typename: "VillainSection",
        title: "Title",
        description: "string",
        villains: [
          {
            __typename: "Promo",
            id: "1234",
            name: "Villain 1",
            title: "Villain 1",
            brandLogo: null,
            tags: null,
            subtitle: null,
            body: null,
            featuredMedia: null,
            cta: null,
            featuredVideo: null,
            backgroundColor: "White"
          },
          {
            __typename: "Promo",
            id: "3456",
            name: "Villain 2",
            title: "Villain 2",
            brandLogo: null,
            tags: null,
            subtitle: null,
            body: null,
            featuredMedia: null,
            cta: null,
            featuredVideo: null,
            backgroundColor: "Alabaster"
          }
        ],
        isReversed: false
      },
      {
        __typename: "CardCollectionSection",
        title: "card collection section title",
        justifyCenter: false,
        displaySingleRow: false,
        description: null,
        groupCards: false,
        cardLabel: "Card Label",
        cardType: "Story Card",
        sortOrder: null,
        link: {
          __typename: "Link",
          id: "00000000-0000-0000-0000-000000000000",
          label: "Contact us",
          icon: null,
          isLabelHidden: null,
          url: null,
          linkedPage: {
            path: "contact-us"
          },
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null,
          queryParams: null
        },
        cards: [
          {
            __typename: "Promo",
            name: "promo title",
            title: "promo title",
            brandLogo: "AeroDek",
            subtitle: "promo subtitle",
            body: null,
            tags: null,
            featuredMedia: null,
            featuredVideo: null,
            cta: {
              __typename: "Link",
              id: "00000000-0000-0000-0000-000000000000",
              label: "Contact us",
              icon: null,
              isLabelHidden: null,
              url: null,
              linkedPage: {
                path: "contact-us"
              },
              type: DataTypeEnum.Internal,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null,
              queryParams: null
            },
            id: "00000000-0000-0000-0000-000000000000",
            backgroundColor: null
          }
        ]
      },
      {
        __typename: "CardCollectionSection",
        title: "card section title 2",
        justifyCenter: false,
        description: null,
        groupCards: false,
        cardLabel: "Go to {{title}}",
        cardType: "Highlight Card",
        link: null,
        sortOrder: null,
        displaySingleRow: false,
        cards: [
          {
            __typename: "Page",
            id: "00000000-0000-0000-0000-000000000000",
            path: "path",
            slug: "slug",
            tags: null,
            title: "page title",
            brandLogo: null,
            subtitle: "page subtitle",
            date: null,
            rawDate: null,
            featuredMedia: createImageData(),
            featuredVideo: null
          }
        ]
      },
      {
        __typename: "Promo",
        id: "5678",
        name: "card section title 2",
        title: "card section title 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: {
          __typename: "Link",
          id: "string",
          label: "string",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page",
          linkedPage: null,
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null,
          queryParams: null
        },
        featuredVideo: {
          __typename: "Video",
          title: "Video",
          label: "Video",
          subtitle: null,
          videoUrl: "https://www.youtube.com/watch?v=abc123",
          previewMedia: null,
          videoRatio: null,
          defaultYouTubePreviewImage:
            "https://i.ytimg.com/vi/abc123/maxresdefault.jpg"
        },
        backgroundColor: null
      },
      {
        __typename: "Promo",
        id: "5678",
        name: "card section title 2",
        title: "card section title 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: createImageData(),
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      },
      {
        __typename: "ContentfulMediaGallerySection",
        title: "Gallery title",
        longDescription: null,
        medias: [createGallerySectionImage()]
      },
      {
        __typename: "ContentfulDocumentDownloadSection",
        title: "Document Downloads",
        description: createRichText({
          json: contentMock,
          references: new Map()
        }),
        documents: []
      },
      {
        __typename: "ServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        title: "Service Locator",
        showDefaultResultList: true,
        label: "Find A Roofer",
        body: null,
        services: null,
        position: 0,
        centre: null,
        zoom: null
      },
      {
        __typename: "ServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        title: "Service Locator - with services",
        showDefaultResultList: true,
        label: "Find A Roofer",
        body: null,
        services: [
          createService({
            id: "roofer_1",
            name: "roofer 1",
            serviceTypes: [
              { __typename: "ServiceType", name: "Pitched Roof" },
              { __typename: "ServiceType", name: "Flat Roof" }
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            serviceTypes: [
              { __typename: "ServiceType", name: "Pitched Roof" },
              { __typename: "ServiceType", name: "Flat Roof" }
            ]
          })
        ],
        position: 0,
        centre: null,
        zoom: null
      },
      {
        __typename: "VideoSection",
        name: "Video section",
        title: "Section title",
        description: createRichText({
          json: contentMock,
          references: new Map()
        }),
        video: {
          __typename: "Video",
          title: "Video title",
          label: "Video label",
          videoUrl: "https://www.youtube.com/watch?v=A-RfHC91Ewc",
          subtitle: null,
          previewMedia: null,
          videoRatio: { width: 16, height: 9 },
          defaultYouTubePreviewImage:
            "https://i.ytimg.com/vi/A-RfHC91Ewc/maxresdefault.jpg"
        }
      },
      {
        __typename: "ContentfulTeamSection",
        title: "Team Section - alabaster",
        teamCategories: [
          {
            id: "team-category-id-1",
            title: "Team Category 1",
            description: createRichText({
              json: contentMock,
              references: new Map()
            }),
            team_member: [
              {
                name: "Bob McBobbinson",
                jobTitle: "CEO",
                profileImage: {
                  __typename: "Image",
                  title: "Title",
                  altText: "alt text",
                  image: {
                    fileName: "test-filename",
                    url: "https://testImage.jpg",
                    contentType: "image/jpg",
                    width: 100,
                    height: 100,
                    size: 100
                  }
                },
                links: []
              }
            ]
          }
        ],
        backgroundColor: "Alabaster"
      },
      {
        __typename: "ContentfulTeamSection",
        title: "Team Section - undefined colour (2 categories)",
        teamCategories: [
          {
            id: "team-category-id-1",
            title: "Team Category 1",
            description: createRichText({
              json: contentMock,
              references: new Map()
            }),
            team_member: [
              {
                name: "Bob McBobbinson",
                jobTitle: "CEO",
                profileImage: {
                  __typename: "Image",
                  title: "Title",
                  altText: "alt text",
                  image: {
                    fileName: "test-filename",
                    url: "https://testImage.jpg",
                    contentType: "image/jpg",
                    width: 100,
                    height: 100,
                    size: 100
                  }
                },
                links: []
              }
            ]
          },
          {
            id: "team-category-id-2",
            title: "Team Category 2",
            description: null,
            team_member: [
              {
                name: "Johnny McJohnson",
                jobTitle: "CEO",
                profileImage: {
                  __typename: "Image",
                  title: "Title",
                  altText: "alt text",
                  image: {
                    fileName: "test-filename",
                    url: "https://testImage.jpg",
                    contentType: "image/jpg",
                    width: 100,
                    height: 100,
                    size: 100
                  }
                },
                links: []
              }
            ]
          }
        ],
        backgroundColor: null
      },
      {
        __typename: "Navigation",
        label: "Explore",
        links: [
          {
            __typename: "Link",
            id: "string",
            label: "string",
            icon: null,
            isLabelHidden: false,
            url: "link-to-page",
            linkedPage: null,
            type: DataTypeEnum.Internal,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null,
            queryParams: null
          }
        ]
      },
      {
        __typename: "Form",

        title: "Form section",
        showTitle: true,
        description: null,
        recipients: "test@example.com",
        inputs: [
          {
            label: "First name",
            name: "first-name",
            options: undefined,
            type: "text",
            required: true,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Second name",
            name: "second-names",
            options: undefined,
            type: "text",
            required: true,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Email address",
            name: "email",
            options: undefined,
            type: "email",
            required: true,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Company name(if Applicable)",
            name: "company",
            options: undefined,
            type: "text",
            required: false,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Telephone",
            name: "telephone",
            options: undefined,
            type: "phone",
            required: false,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Type of query",
            name: "recipients",
            options:
              "General enquiry, Product return/Damaged goods=vijay.parsa@bmigroup.com, Question about a product, Request for technical information, Warranty information, Complaint, Order placement, Request for case references, Help with large tenders, Directions to locations where customers can buy BMI products, Request a brochure, Report a damaged product",
            type: "select",
            required: true,
            width: "half",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Attach Files (optional)",
            name: "files",
            options: undefined,
            type: "upload",
            required: false,
            width: "full",
            accept: ".pdf, .jpg, .jpeg, .png",
            maxSize: 5
          },
          {
            label: "Your message",
            name: "message",
            options: undefined,
            type: "textarea",
            required: true,
            width: "full",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Send a copy of this message to my email address",
            name: "send-copy",
            options: undefined,
            type: "checkbox",
            required: false,
            width: "full",
            accept: undefined,
            maxSize: undefined
          },
          {
            label: "Sign up for BMI newsletter",
            name: "sign-up",
            options: undefined,
            type: "checkbox",
            required: false,
            width: "full",
            accept: undefined,
            maxSize: undefined
          },
          {
            label:
              "I agree with BMI's [Data Protection Policy](https://google.co.uk)",
            name: "data-protection",
            options: undefined,
            type: "checkbox",
            required: true,
            width: "full",
            accept: undefined,
            maxSize: undefined
          },
          {
            label:
              "I accept that my information may be processed and used solely for the submission of information and advertising about products, services and other activities. I have the right to revoke this agreement in writing at any time.",
            name: "gdpr",
            options: undefined,
            type: "checkbox",
            required: true,
            width: "full",
            accept: undefined,
            maxSize: undefined
          }
        ],
        submitText: "Submit",
        successRedirect: {
          __typename: "Link",
          id: "ce304ce0-35f7-5738-9472-50beb3624ea8",
          label: "Thank you",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: DataTypeEnum.Internal,
          linkedPage: {
            path: "thank-you/"
          },
          asset: null,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null,
          queryParams: null
        },
        source: SourceType.Contentful,
        hubSpotFormGuid: null
      }
    ];

    const { container } = renderWithRouter(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when incomplete", () => {
    const data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Accordion"
      },
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Tabs"
      },
      {
        __typename: "VillainSection",
        title: "string"
      }
    ] as Data;

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with 1 villain", () => {
    const data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Accordion"
      },
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "TitleWithContent",
            title: "hello",
            content: createRichText({
              json: contentMock,
              references: new Map()
            })
          }
        ],
        title: "string",
        type: "Tabs"
      },
      {
        __typename: "VillainSection",
        title: "Title",
        villains: [
          {
            __typename: "Promo",
            id: "1234",
            name: "Villain 1",
            title: "Villain 1",
            brandLogo: null,
            tags: null,
            subtitle: null,
            body: null,
            featuredMedia: null,
            cta: null,
            featuredVideo: null
          }
        ],
        isReversed: false
      }
    ] as Data;

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  it("doesnt render correctly if doesnt resolve to component", () => {
    const data: Data = [
      {
        __typename: "ContentfulDocumentDownloadSection",
        title: "Document Downloads",
        description: createRichText({
          json: contentMock,
          references: new Map()
        }),
        documents: []
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders alternate backgrounds for promos", () => {
    const data: Data = [
      {
        __typename: "Promo",
        id: "1",
        name: "Promo 1",
        title: "Promo 1",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      },
      {
        __typename: "Promo",
        id: "2",
        name: "Promo 2",
        title: "Promo 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      },
      {
        __typename: "Promo",
        id: "3",
        name: "Promo 3",
        title: "Promo 3",
        subtitle: null,
        body: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: [
              {
                nodeType: BLOCKS.HEADING_2,
                content: [
                  { nodeType: "text", value: "Heading 2", marks: [], data: {} }
                ],
                data: {}
              }
            ]
          },
          references: new Map()
        }),
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  it("render embedded script to the component", () => {
    const data: Data = [
      {
        __typename: "EmbeddedScriptSection",
        title: "Embedded Script",
        scriptSectionId: "test-id",
        url: "https://test-url",
        ecmaScript: false
      }
    ];

    render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );

    expect(
      screen.getByRole("heading", { name: "Embedded Script" })
    ).toBeInTheDocument();
  });
});
