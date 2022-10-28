import React from "react";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import ContactUsPage, { Data } from "../contact-us-page";

describe("Contact us page", () => {
  const data: { contentfulContactUsPage: Data; contentfulSite: any } = {
    contentfulContactUsPage: {
      __typename: "ContentfulContactUsPage",
      id: "abc123",
      title: "How can we help?",
      subtitle: "Find your local office contact details below",
      brandLogo: null,
      slug: "contact-us",
      path: "contact-us/",
      date: null,
      tags: [{ title: "Test page type tag", type: "Page type" }],
      nextBestActions: [
        {
          __typename: "ContentfulPromo",
          id: "osyfb64chkucgrh76we",
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
        },
        {
          __typename: "ContentfulPromo",
          id: "q345789naetw9ny84",
          name: "Action 2",
          title: "Action 2",
          subtitle: null,
          body: null,
          brandLogo: null,
          tags: null,
          featuredMedia: null,
          cta: null,
          featuredVideo: null,
          backgroundColor: null
        }
      ],
      featuredMedia: null,
      featuredVideo: {
        __typename: "ContentfulVideo",
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
              __typename: "ContentfulTitleWithContent",
              name: "Our installation instructions show how a product is assembled",
              title:
                "Our installation instructions show how a product is assembled",
              content: {
                raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"If you need help with mounting a product or accessory, our mounting instructions show how a product is assembled and what accessories should be used, if any.","nodeType":"text"}],"nodeType":"paragraph"},{"data":{},"content":[{"data":{},"marks":[],"value":"","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
                references: []
              }
            },
            {
              __typename: "ContentfulTitleWithContent",
              name: "You can check relevant technical information whilst browsing our site",
              title:
                "You can check relevant technical information whilst browsing our site",
              content: {
                raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Technical product information such as performance guarantees, dimensions, colours etc. are documented in our technical documentation.","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
                references: []
              }
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
              __typename: "ContentfulTitleWithContent",
              name: "Use our online form",
              title: "Use our online form",
              content: {
                raw: '{"data":{},"content":[{"data":{"target":{"sys":{"id":"7CVaEtq6uudGvsBBRvArMM","type":"Link","linkType":"Entry"}}},"content":[],"nodeType":"embedded-entry-block"},{"data":{},"content":[{"data":{},"marks":[],"value":"","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
                references: []
              }
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
              otherInformation: {
                raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Monday - Friday,  08:00 - 17:00","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
                references: []
              }
            },
            {
              __typename: "ContentfulTitleWithContent",
              name: "Use our online form",
              title: "Use our online form",
              content: {
                raw: '{"data":{},"content":[{"data":{"target":{"sys":{"id":"7CVaEtq6uudGvsBBRvArMM","type":"Link","linkType":"Entry"}}},"content":[],"nodeType":"embedded-entry-block"},{"data":{},"content":[{"data":{},"marks":[],"value":"","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
                references: []
              }
            }
          ]
        }
      ],
      signupBlock: {
        __typename: "ContentfulSignupBlock",
        title: "Sign up for our newsletter",
        description: {
          description:
            "Get the very latest roofing news, tips, product information and innovations directly from BMI straight to your inbox."
        },
        signupLabel: "Sign up",
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
      },
      seo: {
        metaTitle: "BMI - Contact Us",
        metaDescription: "How can we help?",
        noIndex: false
      },
      sections: [
        {
          __typename: "ContentfulCardCollectionSection",
          title: "Testing Card Collection",
          description: {
            raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Texhting frhrofherfeh ffefeifehfi f","nodeType":"text"}],"nodeType":"paragraph"},{"data":{},"content":[{"data":{},"marks":[],"value":"","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
            references: []
          },
          cardType: "Highlight Card",
          cardLabel: "Testing ",
          groupCards: true,
          link: null,
          sortOrder: null,
          cards: [
            {
              __typename: "ContentfulSimplePage",
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
              date: null
            },
            {
              __typename: "ContentfulPromo",
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
                __typename: "ContentfulVideo",
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
          otherInformation: {
            raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Monday - Friday 8:00 - 16:00","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
            references: []
          }
        },
        {
          __typename: "ContentfulContactDetails",
          title: "BMI Norway",
          address: "Fjellhamarveien 52, P.O. Box 55, Fjellhamar, Norway, 1477",
          phoneNumber: "0370 560 1000",
          email: "www.bmigroup.com/no",
          otherInformation: {
            raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"Monday - Friday 8:00 - 16:00","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
            references: []
          }
        },
        {
          __typename: "ContentfulContactDetails",
          title: "BMI France",
          address: "23-25 Avenue du Dr Lannelongue, Paris, France, 75014",
          phoneNumber: "004478123456789",
          email: "www.bmigroup.com/fr",
          otherInformation: {
            raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"Test test test PREview ","marks":[],"data":{}}],"data":{}}]}',
            references: []
          }
        }
      ],
      iframe: {
        __typename: "ContentfulIframe",
        title: "iFrame section",
        summary: null,
        url: "https://bot.leadoo.com/bot/inpage.html?code=eoUfGmeD",
        height: "450px"
      }
    },
    contentfulSite: createMockSiteData()
  };

  it("renders correctly", () => {
    const { container, getByTestId, getByText } = renderWithRouter(
      <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(container.querySelectorAll(".Footer").length).toBe(1);
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector(".Hero")).toBeTruthy();
    expect(container.querySelector(".Hero .Breadcrumbs")).toBeTruthy();
    expect(container.querySelector(".Section--pearl")).toBeTruthy();
    expect(getByText("What do you wish to contact us about?")).toBeTruthy();
    expect(container.querySelector(".ContactTopics")).toBeTruthy();
    expect(getByText("No footer")).toBeTruthy();
    expect(getByText("Did you know?")).toBeTruthy();
    expect(
      container.querySelector(".Section--alabaster.Section--slim")
    ).toBeTruthy();
    expect(
      container.querySelector(".Section--alabaster.Section--slim .Breadcrumbs")
    ).toBeTruthy();
  });

  it("render iframe correctly", () => {
    const { container, getByText } = renderWithRouter(
      <ContactUsPage data={data} pageContext={null} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".IframeSection")).toBeTruthy();
    expect(getByText("iFrame section")).toBeTruthy();
    expect(container.querySelector(".IframeSection .summary")).toBeFalsy();
    expect(container.querySelector(".IframeSection .iFrame")).toHaveAttribute(
      "height",
      "450px"
    );
  });

  it("render Sections correctly", () => {
    const { container, getByText } = renderWithRouter(
      <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container).toMatchSnapshot();
    expect(getByText("Testing Card Collection")).toBeTruthy();
  });

  it("render location correctly", () => {
    const { container, getByText } = renderWithRouter(
      <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".Section--white")).toBeTruthy();
    expect(getByText("Locations")).toBeTruthy();
    expect(container.querySelectorAll(".Locations .LocationCard").length).toBe(
      3
    );
  });

  it("render NextBestActions correctly", () => {
    const { container, getByText } = renderWithRouter(
      <ContactUsPage data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container).toMatchSnapshot();
    expect(getByText("Mer informasjon")).toBeTruthy();
    expect(container.querySelectorAll(".NBACard").length).toBe(2);
  });

  it("render firstslide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    newData.contentfulContactUsPage.featuredVideo = null;
    newData.contentfulContactUsPage.featuredMedia = {
      type: null,
      altText: "featuredMediaAltText",
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
        src: "//images.asset.jpg",
        file: {
          fileName: "Lorem ipsum",
          url: "//images.asset.jpg"
        }
      }
    };
    const { container } = renderWithRouter(
      <ContactUsPage
        data={newData}
        pageContext={{ variantCodeToPathMap: {} }}
      />
    );

    expect(container).toMatchSnapshot();
    expect(
      container.querySelector("[alt='featuredMediaAltText']")
    ).toBeTruthy();
  });
});
