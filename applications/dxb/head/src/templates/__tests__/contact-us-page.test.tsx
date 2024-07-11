import ThemeProvider from "@bmi-digital/components/theme-provider";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { Data as SiteData } from "../../components/Site";
import { SourceType } from "../../components/types/FormSectionTypes";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import ContactUsPage, { Data } from "../contact-us-page";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import createPageInfoData from "../../__tests__/helpers/PageInfoHelper";
import createRichText from "../../__tests__/helpers/RichTextHelper";

describe("Contact us page", () => {
  const data: { contentfulContactUsPage: Data; contentfulSite: SiteData } = {
    contentfulContactUsPage: {
      __typename: "ContentfulContactUsPage",
      id: "abc123",
      title: "How can we help?",
      subtitle: "Find your local office contact details below",
      brandLogo: null,
      slug: "contact-us",
      path: "contact-us/",
      date: null,
      rawDate: null,
      tags: [{ title: "Test page type tag", type: "Page type" }],
      nextBestActions: [createPromoData(), createPageInfoData()],
      featuredMedia: null,
      featuredVideo: {
        __typename: "Video",
        title: "featuredVideo",
        label: "label",
        subtitle: null,
        videoUrl: "https://www.youtube.com/watch?v=youtubeId",
        previewMedia: null,
        videoRatio: null,
        defaultYouTubePreviewImage:
          "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
      },
      breadcrumbs: [
        {
          id: "abc123",
          label: "How can we help?",
          slug: "contact-us"
        }
      ],
      breadcrumbTitle: "",
      queriesTitle: "What do you wish to contact us about?",
      queriesSubtitle: "Choose one of the options below",
      contentTopics: [
        {
          icon: "build",
          title: "No footer",
          bodyTitle: "Did you know?",
          bodyList: [
            {
              __typename: "TitleWithContent",
              name: "Our installation instructions show how a product is assembled",
              title:
                "Our installation instructions show how a product is assembled",
              content: createRichText({
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value:
                            "If you need help with mounting a product or accessory, our mounting instructions show how a product is assembled and what accessories should be used, if any.",
                          nodeType: "text"
                        }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    },
                    {
                      data: {},
                      content: [
                        { data: {}, marks: [], value: "", nodeType: "text" }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    }
                  ],
                  nodeType: BLOCKS.DOCUMENT
                }
              })
            },
            {
              __typename: "TitleWithContent",
              name: "You can check relevant technical information whilst browsing our site",
              title:
                "You can check relevant technical information whilst browsing our site",
              content: createRichText({
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value:
                            "Technical product information such as performance guarantees, dimensions, colours etc. are documented in our technical documentation.",
                          nodeType: "text"
                        }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    }
                  ],
                  nodeType: BLOCKS.DOCUMENT
                }
              })
            }
          ],
          footerTitle: null,
          footerList: null
        },
        {
          icon: "shoppingCart",
          title: "Only body list and footer",
          bodyTitle: null,
          bodyList: [
            {
              __typename: "TitleWithContent",
              name: "Use our online form",
              title: "Use our online form",
              content: createRichText({
                json: {
                  data: {},
                  content: [
                    {
                      data: {
                        target: {
                          sys: {
                            id: "7CVaEtq6uudGvsBBRvArMM",
                            type: "Link",
                            linkType: "Entry"
                          }
                        }
                      },
                      content: [],
                      nodeType: BLOCKS.EMBEDDED_ENTRY
                    },
                    {
                      data: {},
                      content: [
                        { data: {}, marks: [], value: "", nodeType: "text" }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    }
                  ],
                  nodeType: BLOCKS.DOCUMENT
                }
              })
            }
          ],
          footerTitle: "Still need help?",
          footerList: [
            {
              __typename: "ContentfulContactDetails",
              title: "Technical department",
              address: null,
              phoneNumber: "67679090",
              email: "vijay@bmigroup.com",
              otherInformation: createRichText({
                json: {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: "Monday - Friday,  08:00 - 17:00",
                          nodeType: "text"
                        }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    }
                  ],
                  nodeType: BLOCKS.DOCUMENT
                }
              })
            },
            {
              __typename: "TitleWithContent",
              name: "Use our online form",
              title: "Use our online form",
              content: createRichText({
                json: {
                  data: {},
                  content: [
                    {
                      data: {
                        target: {
                          sys: {
                            id: "7CVaEtq6uudGvsBBRvArMM",
                            type: "Link",
                            linkType: "Entry"
                          }
                        }
                      },
                      content: [],
                      nodeType: BLOCKS.EMBEDDED_ENTRY
                    },
                    {
                      data: {},
                      content: [
                        { data: {}, marks: [], value: "", nodeType: "text" }
                      ],
                      nodeType: BLOCKS.PARAGRAPH
                    }
                  ],
                  nodeType: BLOCKS.DOCUMENT
                }
              })
            }
          ]
        }
      ],
      signupBlock: {
        __typename: "SignupBlock",
        title: "Sign up for our newsletter",
        signUpBlockDescription:
          "Get the very latest roofing news, tips, product information and innovations directly from BMI straight to your inbox.",
        signupLabel: "Sign up",
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
      },
      seo: {
        metaTitle: "BMI - Contact Us",
        metaDescription: "How can we help?",
        noIndex: false
      },
      sections: [
        {
          __typename: "CardCollectionSection",
          title: "Testing Card Collection",
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
                      value: "Texhting frhrofherfeh ffefeifehfi f",
                      nodeType: "text"
                    }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                },
                {
                  data: {},
                  content: [
                    { data: {}, marks: [], value: "", nodeType: "text" }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                }
              ],
              nodeType: BLOCKS.DOCUMENT
            }
          }),
          cardType: "Highlight Card",
          cardLabel: "Testing ",
          groupCards: true,
          link: null,
          sortOrder: null,
          cards: [
            {
              __typename: "Page",
              id: "d6f5c74e-1e7a-56fe-91b9-4ae5001ecd8c",
              title: "News article page 2",
              subtitle:
                "BMI Latest news and stuff! What do you want to know about? ",
              brandLogo: null,
              slug: "news-article-page",
              path: "frequently-asked-questions/news-article-page/",
              tags: [
                { title: "News", type: "Page type" },
                { title: "News", type: "Group" }
              ],
              featuredMedia: null,
              featuredVideo: null,
              date: null,
              rawDate: null
            },
            {
              __typename: "Promo",
              id: "a6f7e167-7c2b-5336-8df1-24e14f7203b8",
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
                  "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg"
              },
              backgroundColor: null
            }
          ],
          justifyCenter: null,
          displaySingleRow: null
        }
      ],
      locationsTitle: "Locations",
      locations: [
        {
          __typename: "ContentfulContactDetails",
          title: "BMI Group Corporate Headquarters",
          address:
            "Thames Tower, 4th Floor, Station Rd, Reading, United Kingdom, RG1 1LX",
          phoneNumber: "0370 560 1000",
          email: "contactus@bmigroup.com",
          otherInformation: createRichText({
            json: {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    {
                      data: {},
                      marks: [],
                      value: "Monday - Friday 8:00 - 16:00",
                      nodeType: "text"
                    }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                }
              ],
              nodeType: BLOCKS.DOCUMENT
            }
          })
        },
        {
          __typename: "ContentfulContactDetails",
          title: "BMI Norway",
          address: "Fjellhamarveien 52, P.O. Box 55, Fjellhamar, Norway, 1477",
          phoneNumber: "0370 560 1000",
          email: "www.bmigroup.com/no",
          otherInformation: createRichText({
            json: {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    {
                      data: {},
                      marks: [],
                      value: "Monday - Friday 8:00 - 16:00",
                      nodeType: "text"
                    }
                  ],
                  nodeType: BLOCKS.PARAGRAPH
                }
              ],
              nodeType: BLOCKS.DOCUMENT
            }
          })
        },
        {
          __typename: "ContentfulContactDetails",
          title: "BMI France",
          address: "23-25 Avenue du Dr Lannelongue, Paris, France, 75014",
          phoneNumber: "004478123456789",
          email: "www.bmigroup.com/fr",
          otherInformation: createRichText({
            json: {
              nodeType: BLOCKS.DOCUMENT,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  content: [
                    {
                      nodeType: "text",
                      value: "Test test test PREview ",
                      marks: [],
                      data: {}
                    }
                  ],
                  data: {}
                }
              ]
            }
          })
        }
      ],
      iframe: {
        __typename: "Iframe",
        title: "iFrame section",
        summary: null,
        url: "https://bot.leadoo.com/bot/inpage.html?code=eoUfGmeD",
        height: "450px",
        allowCookieClasses: null
      }
    },
    contentfulSite: createMockSiteData()
  };

  it("renders correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("render iframe correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage data={data} pageContext={{}} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.getByTestId(
        `iframe-section-${replaceSpaces(
          data.contentfulContactUsPage.iframe!.title
        )}`
      )
    ).toBeInTheDocument();
  });

  it("render Sections correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Testing Card Collection")).toBeTruthy();
  });

  it("render location correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.getByTestId(
        `contact-us-page-locations-section-${replaceSpaces(
          data.contentfulContactUsPage.queriesTitle
        )}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Locations")).toBeTruthy();
    data.contentfulContactUsPage.locations!.forEach((item, index) => {
      expect(screen.getByTestId(`locations-card-${index}`)).toBeInTheDocument();
    });
  });

  it("render NextBestActions correctly", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Mer informasjon")).toBeTruthy();
    expect(
      screen.getByTestId("nba-card-Contentful-Promo-Title")
    ).toBeInTheDocument();
    expect(screen.getByTestId("nba-card-example-title")).toBeInTheDocument();
  });

  it("render first slide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    newData.contentfulContactUsPage.featuredVideo = null;
    newData.contentfulContactUsPage.featuredMedia = createImageData();
    const { container } = renderWithRouter(
      <ThemeProvider>
        <ContactUsPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.getByAltText(newData.contentfulContactUsPage.featuredMedia.altText)
    ).toBeTruthy();
  });
});
