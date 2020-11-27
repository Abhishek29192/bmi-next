import React from "react";
import Sections, { Data } from "../Sections";
import { render } from "@testing-library/react";
import { BLOCKS } from "@contentful/rich-text-types";
import mockConsole from "jest-mock-console";
import { SiteContext } from "../Site";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContext.Provider
      value={{
        node_locale: "en-UK",
        homePage: { title: "Home Page" },
        getMicroCopy: (path) => path,
        countryCode: "uk"
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

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
              json: {
                data: {},
                nodeType: BLOCKS.DOCUMENT,
                content: []
              }
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
              json: {
                data: {},
                nodeType: BLOCKS.DOCUMENT,
                content: []
              }
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
            title: "Villain 1",
            brandLogo: null,
            tag: null,
            subtitle: null,
            featuredImage: null,
            cta: null
          },
          {
            __typename: "ContentfulPromo",
            title: "Villain 2",
            brandLogo: null,
            tag: null,
            subtitle: null,
            featuredImage: null,
            cta: null
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
            slug: "contact-us"
          }
        },
        cards: [
          {
            __typename: "ContentfulPromo",
            title: "promo title",
            brandLogo: "AeroDek",
            subtitle: "promo subtitle",
            tag: null,
            featuredImage: null,
            cta: {
              __typename: "ContentfulLink",
              id: "00000000-0000-0000-0000-000000000000",
              label: "Contact us",
              icon: null,
              isLabelHidden: null,
              url: null,
              linkedPage: {
                slug: "contact-us"
              }
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
            slug: "slug",
            tag: null,
            title: "page title",
            brandLogo: null,
            subtitle: "page subtitle",
            featuredImage: {
              resize: {
                src: "//image-url"
              }
            }
          }
        ]
      },
      {
        __typename: "ContentfulPromo",
        title: "card section title 2",
        subtitle: null,
        brandLogo: null,
        tag: null,
        featuredImage: null,
        cta: null
      },
      {
        __typename: "ContentfulImageGallerySection",
        title: "Gallery title",
        description: {
          description: "card section 1 description"
        },
        images: [
          {
            title: "my test title",
            mainSource: { src: "url" },
            thumbnail: { src: "url" }
          },
          {
            title: "my test title2",
            mainSource: { src: "url2" },
            thumbnail: { src: "url2" }
          }
        ]
      },
      {
        __typename: "ContentfulDocumentDownloadSection",
        title: "Document Downloads",
        description: {
          json: {
            data: {},
            nodeType: BLOCKS.DOCUMENT,
            content: []
          }
        },
        documents: []
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
