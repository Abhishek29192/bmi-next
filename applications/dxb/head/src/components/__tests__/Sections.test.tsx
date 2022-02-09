import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import Sections, { Data } from "../Sections";
import { SiteContextProvider } from "../Site";
import { EntryTypeEnum, rooferTypes } from "../Service";
import createService from "../../__tests__/ServiceHelper";
import { DataTypeEnum } from "../Link";
import { renderWithRouter } from "../../test/renderWithRouter";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
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
    </SiteContextProvider>
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
            __typename: "ContentfulPromo",
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
          },
          {
            __typename: "ContentfulPromo",
            id: "4567",
            name: "Villain 3",
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
        sortOrder: null,
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
          dialogContent: null,
          hubSpotCTAID: null
        },
        cards: [
          {
            __typename: "ContentfulPromo",
            name: "promo title",
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
              dialogContent: null,
              hubSpotCTAID: null
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
        sortOrder: null,
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
            date: null,
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
                file: {
                  fileName: "Lorem ipsum",
                  url: "//images.asset.jpg"
                }
              },
              thumbnail: {
                src: "//images.asset.jpg"
              }
            },
            featuredVideo: null
          }
        ]
      },
      {
        __typename: "ContentfulPromo",
        id: "5678",
        name: "card section title 2",
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
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        },
        featuredVideo: {
          title: "Video",
          label: "Video",
          subtitle: null,
          youtubeId: "abc123",
          previewMedia: null,
          videoRatio: null
        },
        backgroundColor: null
      },
      {
        __typename: "ContentfulPromo",
        id: "5678",
        name: "card section title 2",
        title: "card section title 2",
        subtitle: null,
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: {
          altText: null,
          type: null,
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
            file: {
              fileName: "image",
              url: "image.png"
            }
          },
          caption: null,
          focalPoint: null,
          thumbnail: {
            src: "//images.asset.jpg"
          }
        },
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      },
      {
        __typename: "ContentfulImageGallerySection",
        title: "Gallery title",
        longDescription: null,
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
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        title: "Service Locator - with services",
        showDefaultResultList: true,
        label: "Find A Roofer",
        body: null,
        services: [
          createService({
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0], rooferTypes[1]]
          }),
          createService({
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
          videoRatio: { width: 16, height: 9 }
        }
      },
      {
        __typename: "ContentfulTeamSection",
        title: "Team Section - alabaster",
        teamCategories: [
          {
            title: "Team Category 1",
            description: {
              raw: contentMock,
              references: []
            },
            team_member: [
              {
                name: "Bob McBobbinson",
                jobTitle: "CEO",
                profileImage: null,
                links: null
              }
            ]
          }
        ],
        backgroundColor: "alabaster"
      },
      {
        __typename: "ContentfulTeamSection",
        title: "Team Section - undefined colour (2 categories)",
        teamCategories: [
          {
            title: "Team Category 1",
            description: {
              raw: contentMock,
              references: []
            },
            team_member: [
              {
                name: "Bob McBobbinson",
                jobTitle: "CEO",
                profileImage: null,
                links: null
              }
            ]
          },
          {
            title: "Team Category 2",
            description: null,
            team_member: [
              {
                name: "Johnny McJohnson",
                jobTitle: "CEO",
                profileImage: null,
                links: null
              }
            ]
          }
        ],
        backgroundColor: null
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
            type: DataTypeEnum.Internal,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null
          }
        ]
      },
      {
        __typename: "ContentfulFormSection",

        title: "Form section",
        showTitle: true,
        description: null,
        recipients: "test@example.com",
        inputs: [
          {
            label: "First name",
            name: "first-name",
            options: null,
            type: "text",
            required: true,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Second name",
            name: "second-names",
            options: null,
            type: "text",
            required: true,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Email address",
            name: "email",
            options: null,
            type: "email",
            required: true,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Company name(if Applicable)",
            name: "company",
            options: null,
            type: "text",
            required: false,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Telephone",
            name: "telephone",
            options: null,
            type: "phone",
            required: false,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Type of query",
            name: "recipients",
            options:
              "General enquiry, Product return/Damaged goods=vijay.parsa@bmigroup.com, Question about a product, Request for technical information, Warranty information, Complaint, Order placement, Request for case references, Help with large tenders, Directions to locations where customers can buy BMI products, Request a brochure, Report a damaged product",
            type: "select",
            required: true,
            width: "half",
            accept: null,
            maxSize: null
          },
          {
            label: "Attach Files (optional)",
            name: "files",
            options: null,
            type: "upload",
            required: false,
            width: "full",
            accept: ".pdf, .jpg, .jpeg, .png",
            maxSize: 5
          },
          {
            label: "Your message",
            name: "message",
            options: null,
            type: "textarea",
            required: true,
            width: "full",
            accept: null,
            maxSize: null
          },
          {
            label: "Send a copy of this message to my email address",
            name: "send-copy",
            options: null,
            type: "checkbox",
            required: false,
            width: "full",
            accept: null,
            maxSize: null
          },
          {
            label: "Sign up for BMI newsletter",
            name: "sign-up",
            options: null,
            type: "checkbox",
            required: false,
            width: "full",
            accept: null,
            maxSize: null
          },
          {
            label:
              "I agree with BMI's [Data Protection Policy](https://google.co.uk)",
            name: "data-protection",
            options: null,
            type: "checkbox",
            required: true,
            width: "full",
            accept: null,
            maxSize: null
          },
          {
            label:
              "I accept that my information may be processed and used solely for the submission of information and advertising about products, services and other activities. I have the right to revoke this agreement in writing at any time.",
            name: "gdpr",
            options: null,
            type: "checkbox",
            required: true,
            width: "full",
            accept: null,
            maxSize: null
          }
        ],
        submitText: "Submit",
        successRedirect: {
          __typename: "ContentfulLink",
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
          hubSpotCTAID: null
        },
        source: "Contentful",
        hubSpotFormGuid: null
      },
      {
        // @ts-ignore
        __typename: "InvalidTypename",
        title: "Invalid type test"
      },
      // @ts-ignore For test coverage
      {}
    ];

    const { container } = renderWithRouter(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container.children).toMatchSnapshot();
  });

  it("renders correctly when incomplete", () => {
    const data = [
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
        __typename: "ContentfulSyndicateSection"
      }
    ] as Data;

    const { container } = render(
      <MockSiteContext>
        <Sections data={data} />
      </MockSiteContext>
    );
    expect(container.children).toMatchSnapshot();
  });

  it("renders correctly with 1 villain", () => {
    const data = [
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

  it("renders alternate backgrounds for promos", () => {
    const data: Data = [
      {
        __typename: "ContentfulPromo",
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
        __typename: "ContentfulPromo",
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
        __typename: "ContentfulPromo",
        id: "3",
        name: "Promo 3",
        title: "Promo 3",
        subtitle: null,
        body: {
          raw: JSON.stringify({
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "heading-2",
                content: [
                  { nodeType: "text", value: "Heading 2", marks: [], data: {} }
                ],
                data: {}
              }
            ]
          }),
          references: []
        },
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
    expect(container.children).toMatchSnapshot();
  });
});
