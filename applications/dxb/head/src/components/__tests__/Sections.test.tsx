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
        reCaptchaKey: "1234",
        reCaptchaNet: false
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
            featuredVideo: null,
            backgroundColor: "White"
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
            featuredVideo: null,
            backgroundColor: "Alabaster"
          },
          {
            __typename: "ContentfulPromo",
            id: "4567",
            title: "Villain 3",
            brandLogo: null,
            tags: null,
            subtitle: null,
            body: null,
            featuredMedia: null,
            cta: null,
            featuredVideo: null,
            // @ts-ignore
            backgroundColor: "Invalid"
          }
        ],
        isReversed: false
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card collection section title",
        justifyCenter: false,
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
          parameters: null,
          dialogContent: null
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
              parameters: null,
              dialogContent: null
            },
            id: "00000000-0000-0000-0000-000000000000",
            backgroundColor: null
          }
        ]
      },
      {
        __typename: "ContentfulCardCollectionSection",
        title: "card section title 2",
        justifyCenter: false,
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
                gatsbyImageData: {
                  images: {
                    sources: [
                      {
                        srcSet:
                          "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                        sizes: "(min-width: 948px) 948px, 100vw",
                        type: "image/webp"
                      }
                    ],
                    fallback: {
                      src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
                      srcSet:
                        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
                      sizes: "(min-width: 948px) 948px, 100vw"
                    }
                  },
                  layout: "constrained",
                  backgroundColor: "#484848",
                  width: 948,
                  height: 720
                },
                resize: {
                  src: "//images.asset.jpg"
                },
                file: {
                  fileName: "Lorem ipsum",
                  url: "//images.asset.jpg"
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
        cta: {
          __typename: "ContentfulLink",
          id: "string",
          label: "string",
          icon: null,
          isLabelHidden: false,
          url: "link-to-page",
          linkedPage: null,
          type: "Internal",
          parameters: null,
          dialogContent: null
        },
        featuredVideo: {
          title: "Video",
          label: "Video",
          subtitle: null,
          youtubeId: "abc123",
          previewMedia: null,
          videoRatio: null,
          className: null
        },
        backgroundColor: null
      },
      {
        __typename: "ContentfulPromo",
        id: "5678",
        title: "card section title 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: {
          altText: null,
          type: null,
          // @ts-ignore Doesn't get this
          image: {
            resize: {
              src: "image.png"
            },
            file: {
              fileName: "image",
              url: "image.png"
            }
          },
          caption: null,
          focalPoint: null
        },
        cta: null,
        featuredVideo: null,
        backgroundColor: null
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
              thumbnail: {
                src: "//images.asset.jpg"
              },
              gatsbyImageData: {
                images: {
                  sources: [
                    {
                      srcSet:
                        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                      sizes: "(min-width: 948px) 948px, 100vw",
                      type: "image/webp"
                    }
                  ],
                  fallback: {
                    src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
                    srcSet:
                      "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
                    sizes: "(min-width: 948px) 948px, 100vw"
                  }
                },
                layout: "constrained",
                backgroundColor: "#484848",
                width: 948,
                height: 720
              },
              resize: {
                src: "//images.asset.jpg"
              },
              file: {
                fileName: "Lorem ipsum",
                url: "//images.asset.jpg"
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
      },
      {
        __typename: "ContentfulNavigation",
        label: "Explore",
        links: [
          {
            __typename: "ContentfulLink",
            id: "string",
            label: "string",
            icon: null,
            isLabelHidden: false,
            url: "link-to-page",
            linkedPage: null,
            type: "Internal",
            parameters: null,
            dialogContent: null
          }
        ]
      },
      {
        // @ts-ignore
        __typename: "InvalidTypename",
        title: "Invalid type test"
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container.children).toMatchSnapshot();
  });

  it("doesnt render correctly if doesnt resolve to component", () => {
    const data: Data = [
      {
        __typename: null, // null is an invalid typename
        title: "Document Downloads",
        description: {
          raw: contentMock,
          references: []
        },
        documents: []
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container.children).toHaveLength(0); // returns empty array
  });
});