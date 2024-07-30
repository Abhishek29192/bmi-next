import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { DataTypeEnum } from "../../components/link/types";
import { Data as OverlapCardData } from "../../components/OverlapCards";
import { Data as SlideData } from "../../components/Promo";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import HomePage, { Data as HomePageData } from "../home-page";
import type { RichTextData } from "../../components/RichText";

let isNextDisabledElasticSearch: boolean;
let isLoginEnabled: boolean;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isNextDisabledElasticSearch,
    isLoginEnabled
  })
}));

describe("Home Page Template", () => {
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
  const sectionsData: HomePageData["homePage"]["sections"] = [
    {
      __typename: "ContentfulTabsOrAccordionSection",
      description: { description: "string" },
      items: [
        {
          __typename: "TitleWithContent",
          name: "hello",
          title: "hello",
          content: createRichText({
            json: contentMock
          })
        }
      ],
      title: "string",
      type: "Accordion"
    }
  ];

  const brandsData: HomePageData["brands"] = [
    {
      title: "Smilex brand",
      path: "/smilex-brand",
      subtitle: "Uh-oh. He don't look happy. He's been using brand X",
      brandLogo: "Icopal"
    }
  ];

  const overlapCardsData: OverlapCardData = [
    {
      title: "Call to action",
      path: "some-page",
      featuredMedia: createImageData(),
      featuredVideo: null
    },
    {
      title: "Call to action",
      path: "some-page",
      featuredMedia: createImageData(),
      featuredVideo: null
    },
    {
      title: "Card with Video",
      path: "some-page",
      featuredMedia: null,
      featuredVideo: {
        __typename: "Video",
        title: "video title",
        label: "video label",
        subtitle: "video subtitle",
        videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
        previewMedia: {
          __typename: "Image",
          title: "Image title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/jpg",
            url: "https://some-url",
            width: 100,
            height: 100,
            size: 100
          }
        },
        defaultYouTubePreviewImage:
          "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg",
        videoRatio: null
      }
    }
  ];

  const slide: SlideData = {
    __typename: "Promo",
    id: "id",
    title: "homePageSlideTitle",
    subtitle: null,
    name: "name",
    body: null,
    brandLogo: null,
    tags: null,
    featuredMedia: null,
    cta: {
      __typename: "Link",
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
      hubSpotCTAID: null,
      queryParams: null
    },
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
    backgroundColor: null
  };
  const title = "string";

  const data: HomePageData["homePage"] = {
    __typename: "HomePage",
    title,
    slides: [slide],
    overlapCards: overlapCardsData,
    sections: sectionsData,
    signupBlock: null,
    seo: null
  };

  it("render correctly with all data", () => {
    isNextDisabledElasticSearch = false;
    isLoginEnabled = true;
    const { container } = renderWithRouter(
      <ThemeProvider>
        <HomePage
          site={createMockSiteData()}
          homePage={data}
          brands={brandsData}
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
    expect(screen.getByTestId("search-submit-button")).toBeInTheDocument();
    expect(screen.getByText(slide.title as string)).toBeInTheDocument();
    expect(screen.getAllByTestId("overlap-card")).toHaveLength(3);
    expect(screen.getByTestId("brands")).toBeInTheDocument();
    expect(
      screen.getByTestId(`tabs-or-accordion-section-${title}`)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("welcome-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("overlap-cards-video")).toBeInTheDocument();
    expect(screen.getByTestId("hero-video")).toBeInTheDocument();
  });

  it("render slide with not Promo __typename and featureMedia data", () => {
    isNextDisabledElasticSearch = false;
    slide.featuredMedia = createImageData({
      altText: "Lorem ipsum Contentful Image"
    });

    slide.featuredVideo = null;
    slide.cta = null;

    renderWithRouter(
      <ThemeProvider>
        <HomePage
          homePage={data}
          brands={brandsData}
          site={createMockSiteData({ resources: null })}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("hero-video")).not.toBeInTheDocument();
    expect(
      screen.getByAltText(slide.featuredMedia.altText)
    ).toBeInTheDocument();
  });

  it("render page with brands", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage
          homePage={data}
          brands={brandsData}
          site={createMockSiteData()}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("brands")).toBeInTheDocument();
    expect(
      screen.getByText(brandsData[0].subtitle as string)
    ).toBeInTheDocument();
  });

  it("render page without brands", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage homePage={data} brands={[]} site={createMockSiteData()} />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("brands")).not.toBeInTheDocument();
  });

  it("render page with overlapCardsData", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage homePage={data} brands={[]} site={createMockSiteData()} />
      </ThemeProvider>
    );

    expect(screen.getAllByTestId("overlap-card")).toHaveLength(3);
  });

  it("render page without overlapCardsData", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage
          homePage={{ ...data, overlapCards: [] }}
          brands={[]}
          site={createMockSiteData()}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("overlap-cards-wrapper")
    ).not.toBeInTheDocument();
  });

  it("render page with sections", () => {
    renderWithRouter(
      <ThemeProvider>
        <HomePage homePage={data} brands={[]} site={createMockSiteData()} />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("tabs-or-accordion-section-string")
    ).toBeInTheDocument();
  });

  it("render page without sections", () => {
    renderWithRouter(
      <HomePage
        homePage={{ ...data, sections: null }}
        brands={[]}
        site={createMockSiteData()}
      />
    );

    expect(
      screen.queryByTestId("tabs-or-accordion-section-string")
    ).not.toBeInTheDocument();
  });
});
