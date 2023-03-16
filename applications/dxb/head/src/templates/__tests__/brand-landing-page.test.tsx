import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { DataTypeEnum } from "../../components/Link";
import { Data as SlideData } from "../../components/Promo";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import BrandLandingPage, {
  Props as BrandLandingPageData
} from "../brand-landing-page";

describe("Brand Landing Page Template", () => {
  const slide: SlideData = {
    __typename: "ContentfulPromo",
    id: "id",
    title: "searchPageNextBestActionsTitle",
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
  const data: BrandLandingPageData["data"] = {
    contentfulSite: createMockSiteData(),
    contentfulBrandLandingPage: {
      __typename: "ContentfulBrandLandingPage",
      id: "id",
      title: "title",
      subtitle: null,
      brandLogo: null,
      slug: "slug",
      path: "path",
      date: null,
      tags: null,
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
      heroType: null,
      cta: null,
      signupBlock: null,
      seo: null,
      description: {
        description: "description"
      },
      slides: [slide],
      overlapCards: null,
      sections: null,
      breadcrumbs: [
        {
          id: "breadcrumbsId",
          label: "breadcrumbsLabel",
          slug: null
        }
      ],
      breadcrumbTitle: "breadcrumbTitle"
    }
  };

  it("render correctly", () => {
    const { container, getByTestId } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector("header")).toBeTruthy();
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(getByTestId("hero")).toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-test-class-name=hero] [aria-label=breadcrumbs]"
      )
    ).toBeTruthy();
    expect(
      container.querySelectorAll("[data-test-class-name=slide]").length
    ).toBe(2);
    expect(
      container.querySelector(
        "[class*='Section'][class*='alabaster'][class*='slim']"
      )
    ).toBeTruthy();
    expect(
      container.querySelector(
        "[class*='Section'][class*='alabaster'][class*='slim'] [aria-label=breadcrumbs]"
      )
    ).toBeTruthy();
  });

  it("render overlapCards correctly", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.overlapCards = [
      {
        __typename: "ContentfulSimplePage",
        title: "Call to action",
        path: "some-page",
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
        }
      },
      {
        __typename: "ContentfulSimplePage",
        title: "Call to action",
        path: "some-page",
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
        }
      }
    ];
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".OverlapCards")).toBeTruthy();
    expect(
      container.querySelectorAll(".OverlapCards [data-test-class-name=card]")
        .length
    ).toBe(2);
  });

  it("render sections correctly", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.sections = [
      {
        __typename: "ContentfulNavigation",
        label: "sectionTitle",
        links: []
      }
    ];
    const { container, getByText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(getByText("sectionTitle")).toBeTruthy();
  });

  it("render firstslide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.featuredVideo = null;
    newData.contentfulBrandLandingPage.featuredMedia = createImageData();
    const { container, getByAltText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      getByAltText(newData.contentfulBrandLandingPage.featuredMedia.altText)
    ).toBeTruthy();
  });

  it("render slide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        featuredVideo: null,
        featuredMedia: createImageData()
      }
    ];
    const { container, getByAltText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      getByAltText(newData.contentfulBrandLandingPage.featuredMedia.altText)
    ).toBeTruthy();
  });

  it("render linkLabel microcopy when slide is has other typename than ContentfulPromo", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        __typename: "ContentfulSimplePage",
        id: "ContentfulSimplePageId",
        title: "ContentfulSimplePageTitle",
        subtitle: null,
        brandLogo: null,
        slug: "ContentfulSimplePageSlug",
        path: "ContentfulSimplePagePath",
        date: null,
        tags: null,
        featuredMedia: null,
        featuredVideo: null
      }
    ];
    const { container, getByText, getByLabelText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = getByLabelText("next");

    fireEvent.click(button);

    expect(container).toMatchSnapshot();
    expect(getByText("Go to page")).toBeTruthy();
  });

  it("not render cta link text when cta object is null", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [{ ...slide, cta: null }];
    const { container, getByLabelText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = getByLabelText("next");

    fireEvent.click(button);

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId("hero-cta")).not.toBeInTheDocument();
  });

  it("not render cta link text when cta label is null", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        cta: {
          __typename: "ContentfulLink",
          id: "cta_id",
          label: null,
          icon: null,
          isLabelHidden: false,
          url: null,
          type: null,
          parameters: null,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      }
    ];
    const { getByLabelText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = getByLabelText("next");

    fireEvent.click(button);

    expect(screen.queryByTestId("hero-cta")).not.toBeInTheDocument();
  });

  it("renders cta link text when cta label is populated", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        cta: {
          __typename: "ContentfulLink",
          id: "cta_id",
          label: "test CTA",
          icon: null,
          isLabelHidden: false,
          url: null,
          type: null,
          parameters: null,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      }
    ];
    const { getByLabelText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = getByLabelText("next");

    fireEvent.click(button);

    expect(screen.queryByTestId("hero-cta")).toBeInTheDocument();
  });

  it("not render link text when typename is not ContentfulPromo and path is null", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        __typename: "ContentfulSimplePage",
        id: "ContentfulSimplePageId",
        title: "ContentfulSimplePageTitle",
        subtitle: null,
        brandLogo: null,
        slug: "ContentfulSimplePageSlug",
        path: null,
        date: null,
        tags: null,
        featuredMedia: null,
        featuredVideo: null
      }
    ];
    const { getByLabelText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = getByLabelText("next");

    fireEvent.click(button);

    expect(screen.queryByText("Go to page")).not.toBeInTheDocument();
  });

  it("render no context for firstslide when no description", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.description = null;
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      container.querySelectorAll(
        "[class*='Hero'] [data-test-class-name=text]"
      )[0].textContent
    ).toBe("");
  });
  it("renders cta on firstSlide if not null", () => {
    const newData = {
      ...data
    };
    newData.contentfulBrandLandingPage.cta = {
      __typename: "ContentfulLink",
      id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
      label: "firstSlideCTA",
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
    };
    const { container, queryByText } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );
    expect(queryByText("firstSlideCTA")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  describe("when description is NOT more than 400 characters", () => {
    it("renders description without elipsis", () => {
      const newData = {
        ...data
      };
      newData.contentfulBrandLandingPage.description = {
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui"
      };
      newData.contentfulBrandLandingPage.cta = {
        __typename: "ContentfulLink",
        id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
        label: "firstSlideCTA",
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
      };
      const { container, queryByText, getByTestId } = renderWithRouter(
        <ThemeProvider>
          <BrandLandingPage
            data={newData}
            pageContext={{ variantCodeToPathMap: {} }}
          />
        </ThemeProvider>
      );
      expect(queryByText("firstSlideCTA")).not.toBeNull();
      expect(
        getByTestId("hero-content-slide-text").textContent.endsWith("...")
      ).toBeFalsy();
      expect(container).toMatchSnapshot();
    });
  });

  describe("when description is more than 400 characters", () => {
    it("renders description with elipsis", () => {
      const newData = {
        ...data
      };
      newData.contentfulBrandLandingPage.description = {
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      };
      newData.contentfulBrandLandingPage.cta = {
        __typename: "ContentfulLink",
        id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
        label: "firstSlideCTA",
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
      };
      const { container, queryByText, getByTestId } = renderWithRouter(
        <ThemeProvider>
          <BrandLandingPage
            data={newData}
            pageContext={{ variantCodeToPathMap: {} }}
          />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
      expect(queryByText("firstSlideCTA")).not.toBeNull();
      expect(
        getByTestId("hero-content-slide-text").textContent.endsWith("...")
      ).toBeTruthy();
    });
  });

  it("render with Search form on hero section", async () => {
    const { container, getByTestId } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage data={data} pageContext={null} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    expect(container.querySelector("header")).toBeTruthy();
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(getByTestId("brand-search-form")).toBeTruthy();
    const formAction = getByTestId("brand-search-form").getAttribute("action");
    expect(formAction).toEqual(`/${data.contentfulSite.countryCode}/search/`);
    expect(getByTestId("brand-search-button")).toBeTruthy();
  });
});
