import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import Sections, { Data } from "../Sections";
import { SiteContext } from "../Site";
import { rooferTypes } from "../../components/Roofer";
import createRoofer from "../../__tests__/RooferHelper";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContext.Provider
      value={{
        node_locale: "en-UK",
        homePage: { title: "Home Page" },
        getMicroCopy: (path) => path,
        countryCode: "uk",
        scriptGRecaptchaId: "",
        scriptGRecaptchaNet: false
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

const contentMock = JSON.stringify({
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
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
});

beforeAll(() => {
  mockConsole();
});

describe("Sections component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        __typename: "ContentfulTabsOrAccordionSection",
        description: { description: "string" },
        items: [
          {
            __typename: "ContentfulTitleWithContent",
            title: "hello",
            content: {
              raw: contentMock,
              references: []
            }
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
            __typename: "ContentfulTitleWithContent",
            title: "hello",
            content: {
              raw: contentMock,
              references: []
            }
          }
        ],
        title: "string",
        type: "Tabs"
      },
      {
        __typename: "ContentfulSyndicateSection",
        title: "Title",
        villains: [
          {
            __typename: "ContentfulPromo",
            id: "1234",
            title: "Villain 1",
            brandLogo: null,
            tags: null,
            subtitle: null,
            body: null,
            featuredMedia: null,
            cta: null,
            featuredVideo: null
          },
          {
            __typename: "ContentfulPromo",
            id: "3456",
            title: "Villain 2",
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
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card collection section title",
        description: null,
        groupCards: false,
        cardLabel: "Card Label",
        cardType: "Story Card",
        link: {
          __typename: "ContentfulLink",
          id: "00000000-0000-0000-0000-000000000000",
          label: "Contact us",
          icon: null,
          isLabelHidden: null,
          url: null,
          linkedPage: {
            path: "contact-us"
          },
          type: null,
          parameters: null
        },
        cards: [
          {
            __typename: "ContentfulPromo",
            title: "promo title",
            brandLogo: "AeroDek",
            subtitle: "promo subtitle",
            body: null,
            tags: null,
            featuredMedia: null,
            featuredVideo: null,
            cta: {
              __typename: "ContentfulLink",
              id: "00000000-0000-0000-0000-000000000000",
              label: "Contact us",
              icon: null,
              isLabelHidden: null,
              url: null,
              linkedPage: {
                path: "contact-us"
              },
              type: null,
              parameters: null
            },
            id: "00000000-0000-0000-0000-000000000000"
          }
        ]
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card section title 2",
        description: null,
        groupCards: false,
        cardLabel: "Go to {{title}}",
        cardType: "Highlight Card",
        link: null,
        cards: [
          {
            __typename: "ContentfulSimplePage",
            id: "00000000-0000-0000-0000-000000000000",
            path: "path",
            slug: "slug",
            tags: null,
            title: "page title",
            brandLogo: null,
            subtitle: "page subtitle",
            featuredMedia: {
              type: null,
              altText: "Lorem ipsum",
              caption: null,
              focalPoint: null,
              image: {
                fluid: {
                  aspectRatio: 1,
                  src: "",
                  srcSet: "",
                  sizes: ""
                },
                resize: {
                  src: "//image-url"
                }
              }
            },
            featuredVideo: null
          }
        ]
      },
      {
        __typename: "ContentfulPromo",
        id: "5678",
        title: "card section title 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: null
      },
      {
        __typename: "ContentfulImageGallerySection",
        title: "Gallery title",
        description: {
          description: "card section 1 description"
        },
        medias: [
          {
            type: null,
            altText: "Lorem ipsum",
            caption: null,
            focalPoint: null,
            image: {
              fluid: {
                aspectRatio: 1,
                src: "",
                srcSet: "",
                sizes: ""
              },
              resize: {
                src: "link-to-page.png"
              },
              thumbnail: {
                src: "link-to-thumbnal.png"
              }
            }
          }
        ]
      },
      {
        __typename: "ContentfulDocumentDownloadSection",
        title: "Document Downloads",
        description: {
          raw: contentMock,
          references: []
        },
        documents: []
      },
      {
        __typename: "ContentfulServiceLocatorSection",
        title: "Service Locator",
        label: "Find A Roofer",
        body: null,
        roofers: null,
        position: 0,
        centre: null,
        zoom: null
      },
      {
        __typename: "ContentfulServiceLocatorSection",
        title: "Service Locator - with roofers",
        label: "Find A Roofer",
        body: null,
        roofers: [
          createRoofer({
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0], rooferTypes[1]]
          }),
          createRoofer({
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0], rooferTypes[1]]
          })
        ],
        position: 0,
        centre: null,
        zoom: null
      },
      {
        __typename: "ContentfulVideoSection",
        name: "Video section",
        title: "Section title",
        description: {
          raw: contentMock,
          references: []
        },
        video: {
          title: "Video title",
          label: "Video label",
          youtubeId: "A-RfHC91Ewc",
          subtitle: null,
          previewMedia: null,
          videoRatio: { width: 16, height: 9 },
          className: null
        }
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container.children).toMatchSnapshot();
  });
});
