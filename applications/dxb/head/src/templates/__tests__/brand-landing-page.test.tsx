import { ThemeProvider } from "@bmi/components";
import { fireEvent } from "@testing-library/react";
import React from "react";
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

    expect(container.querySelector("header")).toBeTruthy();
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector("[data-test-class-name=Hero]")).toBeTruthy();
    expect(
      container.querySelector(
        "[data-test-class-name=Hero] [aria-label=breadcrumbs]"
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
    newData.contentfulBrandLandingPage.featuredMedia = {
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
      <ThemeProvider>
        <BrandLandingPage
          data={newData}
          pageContext={{ variantCodeToPathMap: {} }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      container.querySelector("[alt='featuredMediaAltText']")
    ).toBeTruthy();
  });

  it("render slide featuredMedia instead when no featuredVideo", () => {
    const newData = { ...data };
    newData.contentfulBrandLandingPage.slides = [
      {
        ...slide,
        featuredVideo: null,
        featuredMedia: {
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
    expect(
      container.querySelector("[alt='featuredMediaAltText']")
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
    expect(container.querySelector(".cta .MuiButton-label").textContent).toBe(
      ""
    );
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
});
