import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { DataTypeEnum } from "../../components/Link";
import { Data as SlideData } from "../../components/Promo";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
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
      rawDate: null,
      tags: null,
      featuredMedia: createImageData(),
      heroType: null,
      cta: null,
      signupBlock: null,
      seo: null,
      description: {
        description: "description"
      },
      slides: [slide],
      overlapCards: null,
      sections: [],
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText("sectionTitle")).toBeTruthy();
  });

  it("render slide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    const featuredMedia = createImageData();

    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        featuredVideo: null,
        featuredMedia
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
    expect(screen.getByAltText(featuredMedia.altText)).toBeTruthy();
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
        rawDate: null,
        tags: null,
        featuredMedia: null,
        featuredVideo: null
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

    const button = screen.getByLabelText("next");

    fireEvent.click(button);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Go to page")).toBeTruthy();
  });

  it("not render cta link text when cta object is null", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [{ ...slide, cta: null }];
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("next");

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
          label: "",
          icon: null,
          isLabelHidden: false,
          url: null,
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      }
    ];
    renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("next");

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
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          linkedPage: null,
          hubSpotCTAID: null
        }
      }
    ];
    renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("next");

    fireEvent.click(button);

    expect(screen.getByTestId("hero-cta")).toBeInTheDocument();
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
        path: "",
        date: null,
        rawDate: null,
        tags: null,
        featuredMedia: null,
        featuredVideo: null
      }
    ];
    renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("next");

    fireEvent.click(button);

    expect(screen.queryByText("Go to page")).not.toBeInTheDocument();
  });

  it("render no content for first slide when no description", () => {
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
      // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
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
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("hero-cta")).toBeInTheDocument();
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
      const { container } = renderWithRouter(
        <ThemeProvider>
          <BrandLandingPage
            data={newData}
            pageContext={{ variantCodeToPathMap: {} }}
          />
        </ThemeProvider>
      );
      expect(screen.getByTestId("hero-cta")).toBeInTheDocument();
      expect(
        screen
          .queryByTestId("hero-content-slide-text")
          ?.textContent?.endsWith("...")
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
      const { container } = renderWithRouter(
        <ThemeProvider>
          <BrandLandingPage
            data={newData}
            pageContext={{ variantCodeToPathMap: {} }}
          />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
      expect(screen.getByText("firstSlideCTA")).not.toBeNull();
      expect(
        screen
          .getByTestId("hero-content-slide-text")
          .textContent?.endsWith("...")
      ).toBeTruthy();
    });
  });

  it("render with Search form on hero section", async () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <BrandLandingPage
          data={data}
          pageContext={{ variantCodeToPathMap: undefined }}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("brand-colors-provider")).toBeTruthy();
    expect(screen.getByTestId("brand-search-form")).toBeTruthy();
    const formAction = screen
      .getByTestId("brand-search-form")
      .getAttribute("action");
    expect(formAction).toEqual(`/${data.contentfulSite.countryCode}/search/`);
    expect(screen.getByTestId("brand-search-button")).toBeTruthy();
  });
});
