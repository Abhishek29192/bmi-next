import ThemeProvider from "@bmi-digital/components/theme-provider";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { screen } from "@testing-library/react";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { Data as BrandData } from "../../components/Brands";
import { DataTypeEnum } from "../../components/Link";
import { Data as OverlapCardData } from "../../components/OverlapCards";
import { Data as SlideData } from "../../components/Promo";
import { Data as SectionsData } from "../../components/Sections";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import HomePage, { Props as HomePageData } from "../home-page";

let isGatsbyDisabledElasticSearch: boolean;
let isLoginEnabled: boolean;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isGatsbyDisabledElasticSearch,
    isLoginEnabled
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
  const brandsData: BrandData[] = [
    {
      title: "Smilex brand",
      path: "/smilex-brand",
      subtitle: "Uh-oh. He don't look happy. He's been using brand X",
      brandLogo: "Icopal"
    }
  ];
  const spaBrandsData: BrandData[] = [
    {
      title: "Smilex spa brand",
      path: "/smilex-spa-brand",
      subtitle: "Uh-oh. He don't look happy. He's been using spa brand X",
      brandLogo: "Icopal"
    }
  ];
  const overlapCardsData: OverlapCardData = [
    {
      __typename: "ContentfulSimplePage",
      title: "Call to action",
      path: "some-page",
      featuredMedia: createImageData(),
      featuredVideo: null
    },
    {
      __typename: "ContentfulSimplePage",
      title: "Call to action",
      path: "some-page",
      featuredMedia: createImageData(),
      featuredVideo: null
    },
    {
      __typename: "ContentfulSimplePage",
      title: "Card with Video",
      path: "some-page",
      featuredMedia: createImageData(),
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
  const title = "string";

  const data: HomePageData["data"] = {
    contentfulSite: createMockSiteData(),
    contentfulHomePage: {
      __typename: "ContentfulHomePage",
      title,
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
    isGatsbyDisabledElasticSearch = false;
    isLoginEnabled = true;
    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("brand-colors-provider")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(
      // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
      container.querySelector("[class*=Hero-root] [class*=Breadcrumbs-root]")
    ).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();

    expect(screen.getAllByTestId("hero-content-slide-0").length).toEqual(1);
    expect(screen.getAllByTestId("hero-content-slide-text").length).toEqual(1);
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    expect(screen.getByText(slide.title as string)).toBeInTheDocument();
    expect(screen.getAllByTestId("overlap-card")).toHaveLength(3);
    expect(screen.getByTestId("brands")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `brand-intro-card-${replaceSpaces(
          data.contentfulHomePage.spaBrands[0].title
        )}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`tabs-or-accordion-section-${title}`)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("welcome-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("overlap-cards-video")).toBeInTheDocument();
    expect(screen.getByTestId("hero-video")).toBeInTheDocument();
  });

  it("render slide with not ContentfulPromo __typename and featureMedia data", () => {
    isGatsbyDisabledElasticSearch = false;
    slide.__typename = null;
    slide.featuredMedia = createImageData({
      altText: "Lorem ipsum ContentfulImage"
    });

    slide.featuredVideo = null;
    slide.cta = null;
    data.contentfulSite.resources = null;
    data.contentfulHomePage.spaBrands = [];

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("hero-video")).not.toBeInTheDocument();
    expect(
      screen.getByAltText(slide.featuredMedia.altText)
    ).toBeInTheDocument();
  });

  it("render page with brands", () => {
    data.contentfulHomePage.brands = brandsData;
    data.contentfulHomePage.spaBrands = [];

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("brands")).toBeInTheDocument();
    expect(
      screen.getByText(brandsData[0].subtitle as string)
    ).toBeInTheDocument();
  });

  it("render page with spaBrands", () => {
    data.contentfulHomePage.brands = [];
    data.contentfulHomePage.spaBrands = spaBrandsData;

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("brands")).toBeInTheDocument();
    expect(
      screen.getByText(spaBrandsData[0].subtitle as string)
    ).toBeInTheDocument();
  });

  it("render page without brands and without spaBrands", () => {
    data.contentfulHomePage.spaBrands = [];
    data.contentfulHomePage.brands = [];

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("brands")).not.toBeInTheDocument();
  });

  it("render page with overlapCardsData", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(screen.getAllByTestId("overlap-card")).toHaveLength(3);
  });

  it("render page without overlapCardsData", () => {
    data.contentfulHomePage.overlapCards = null;

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("overlap-cards-wrapper")
    ).not.toBeInTheDocument();
  });

  it("render page with sections", () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.querySelectorAll("[class*=Section-root]")).toHaveLength(1);
  });

  it("render page without sections", () => {
    data.contentfulHomePage.sections = null;

    const { container } = renderWithRouter(
      <HomePage data={data} pageContext={{ variantCodeToPathMap: undefined }} />
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.querySelectorAll("[class*=Section-root]")).toHaveLength(0);
  });
});
