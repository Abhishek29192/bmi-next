import { ThemeProvider } from "@bmi/components";
import React from "react";
import { DataTypeEnum } from "../../components/Link";
import { Data as OverlapCardData } from "../../components/OverlapCards";
import { Data as SlideData } from "../../components/Promo";
import { Data as SectionsData } from "../../components/Sections";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import HomePage, { Props as HomePageData } from "../home-page";

let isSpaEnabled: boolean;
let isGatsbyDisabledElasticSearch: boolean;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    config: {
      isSpaEnabled,
      isGatsbyDisabledElasticSearch
    }
  })
}));

describe("Home Page Template", () => {
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
  const sectionsData: SectionsData = [
    {
      __typename: "ContentfulTabsOrAccordionSection",
      description: { description: "string" },
      items: [
        {
          __typename: "ContentfulTitleWithContent",
          name: "hello",
          title: "hello",
          content: {
            raw: contentMock,
            references: []
          }
        }
      ],
      title: "string",
      type: "Accordion"
    }
  ];
  const brandsData = [
    {
      title: "Smilex brand",
      path: "/smilex-brand",
      subtitle: "Uh-oh. He don't look happy. He's been using brand X",
      brandLogo: "BMI"
    }
  ];
  const spaBrandsData = [
    {
      title: "Smilex spa brand",
      path: "/smilex-spa-brand",
      subtitle: "Uh-oh. He don't look happy. He's been using spa brand X",
      brandLogo: "BMI"
    }
  ];
  const overlapCardsData: OverlapCardData = [
    {
      __typename: "ContentfulSimplePage",
      title: "Call to action",
      path: "some-page",
      featuredMedia: {
        type: null,
        altText: "Lorem ipsum",
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
      },
      featuredVideo: null
    },
    {
      __typename: "ContentfulSimplePage",
      title: "Call to action",
      path: "some-page",
      featuredMedia: {
        type: null,
        altText: "Lorem ipsum",
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
      },
      featuredVideo: null
    },
    {
      __typename: "ContentfulSimplePage",
      title: "Card with Video",
      path: "some-page",
      featuredMedia: {
        type: null,
        altText: "Lorem ipsum",
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
      },
      featuredVideo: {
        __typename: "ContentfulVideo",
        title: "video title",
        label: "video label",
        subtitle: "video subtitle",
        videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
        previewMedia: {
          type: null,
          altText: "Lorem ipsum",
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
          }
        },
        defaultYouTubePreviewImage:
          "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg",
        videoRatio: null
      }
    }
  ];
  const slide: SlideData = {
    __typename: "ContentfulPromo",
    id: "id",
    title: "homePageSlideTitle",
    subtitle: null,
    name: "name",
    body: null,
    brandLogo: null,
    tags: null,
    featuredMedia: null,
    cta: {
      __typename: "ContentfulLink",
      id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
      label: "slideCTA",
      icon: null,
      isLabelHidden: null,
      url: null,
      type: DataTypeEnum.Internal,
      linkedPage: {
        path: "roof-tiles/"
      },
      asset: null,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    },
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
    backgroundColor: null
  };
  const data: HomePageData["data"] = {
    contentfulSite: createMockSiteData(),
    contentfulHomePage: {
      __typename: "ContentfulHomePage",
      title: "title",
      slides: [slide],
      overlapCards: overlapCardsData,
      brands: brandsData,
      spaBrands: spaBrandsData,
      sections: sectionsData,
      breadcrumbs: [
        {
          id: "breadcrumbsId",
          label: "breadcrumbsLabel",
          slug: null
        }
      ],
      signupBlock: null,
      seo: null,
      path: null
    }
  };

  it("render correctly with all data", () => {
    isSpaEnabled = false;
    isGatsbyDisabledElasticSearch = false;

    const { container, getByTestId, getByText } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(getByTestId("brand-colors-provider")).toBeInTheDocument();
    expect(container.querySelector("[class*=Hero-root]")).toBeInTheDocument();
    expect(
      container.querySelector("[class*=Hero-root] [class*=Breadcrumbs-root]")
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll(
        "[class*=Hero-container] [class*=Carousel-wrapper] [class*=Carousel-slide]"
      ).length
    ).toBe(1);
    expect(
      container.querySelectorAll(
        "[class*=Hero-imageCarousel] [class*=Carousel-slide]"
      ).length
    ).toBe(1);
    expect(container.querySelector("[class*=Search-root]")).toBeInTheDocument();
    expect(getByText(slide.title)).toBeInTheDocument();
    expect(container.querySelector(".OverlapCards")).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        ".OverlapCards .MuiGrid-container [class*=Grid-item]"
      ).length
    ).toBe(3);
    expect(container.querySelector(".Brands")).toBeInTheDocument();
    expect(
      container.querySelectorAll(".Brands .MuiGrid-container").length
    ).toBe(1);
    expect(
      container.querySelectorAll("[class*=Section-root]:not(.Brands)").length
    ).toBe(1);
    expect(container.querySelector(".WelcomeDialog")).not.toBeInTheDocument();
    expect(
      container.querySelector("[class*=Hero-root] [class*=YoutubeVideo-root]")
    ).toBeInTheDocument();
  });

  it("render slide with not ContentfulPromo __typename and featureMedia data", () => {
    isSpaEnabled = true;
    isGatsbyDisabledElasticSearch = false;
    slide.__typename = null;
    slide.featuredMedia = {
      type: null,
      altText: "Lorem ipsum ContentfulImage",
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

    slide.featuredVideo = null;
    slide.cta = null;
    data.contentfulSite.resources = null;
    data.contentfulHomePage.spaBrands = [];

    const { container, getByAltText } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(
      container.querySelector("[class*=Hero-root] [class*=YoutubeVideo-root]")
    ).not.toBeInTheDocument();
    expect(getByAltText("Lorem ipsum ContentfulImage")).toBeInTheDocument();
  });

  it("render page with brands", () => {
    data.contentfulHomePage.brands = brandsData;
    data.contentfulHomePage.spaBrands = [];

    const { container, getByText } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector(".Brands")).toBeInTheDocument();
    expect(
      getByText(data.contentfulHomePage.brands[0].subtitle)
    ).toBeInTheDocument();
  });

  it("render page with spaBrands", () => {
    data.contentfulHomePage.brands = [];
    data.contentfulHomePage.spaBrands = spaBrandsData;

    const { container, getByText } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector(".Brands")).toBeInTheDocument();
    expect(
      getByText(data.contentfulHomePage.spaBrands[0].subtitle)
    ).toBeInTheDocument();
  });

  it("render page without brands and without spaBrands", () => {
    data.contentfulHomePage.spaBrands = [];
    data.contentfulHomePage.brands = [];

    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector(".Brands")).not.toBeInTheDocument();
  });

  it("render page with overlapCardsData", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector(".OverlapCards")).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        ".OverlapCards .MuiGrid-container [class*=Grid-item]"
      ).length
    ).toBe(3);
  });

  it("render page without overlapCardsData", () => {
    data.contentfulHomePage.overlapCards = null;

    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container.querySelector(".OverlapCards")).not.toBeInTheDocument();
  });

  it("render page with sections", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(
      container.querySelectorAll("[class*=Section-root]:not(.Brands)").length
    ).toBe(1);
  });

  it("render page without sections", () => {
    data.contentfulHomePage.sections = null;

    const { container } = renderWithRouter(
      <HomePage data={data} pageContext={null} />
    );

    expect(
      container.querySelectorAll("[class*=Section-root]:not(.Brands)").length
    ).toBe(0);
  });
});
