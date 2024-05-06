import { microCopy } from "@bmi/microcopies";
import { GatsbyImage } from "gatsby-plugin-image";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { Context as SiteContext } from "../../components/Site";
import { getMockSiteContext } from "../../components/__tests__/utils/SiteContextProvider";
import { DataTypeEnum } from "../../components/link/types";
import { getHeroItemsWithContext } from "../helpers/getHeroItemsWithContext";
import type { Data as LinkData } from "../../components/link/types";
import type { Data as SlideData } from "../../components/Promo";
import type { ContentfulVideoData } from "../../components/video/types";
import type { Data as PageInfoData } from "../../components/PageInfo";

const context: SiteContext = {
  ...getMockSiteContext("no", "no"),
  getMicroCopy: jest.fn(),
  homePage: {
    title: "hi"
  }
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("getHeroItemsWithContext", () => {
  const featuredVideo: ContentfulVideoData = {
    __typename: "ContentfulVideo",
    title: "featuredVideo",
    label: "label",
    subtitle: null,
    videoUrl: "https://www.youtube.com/watch?v=youtubeId",
    previewMedia: null,
    videoRatio: null,
    defaultYouTubePreviewImage:
      "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
  };

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
    featuredVideo,
    backgroundColor: null
  };

  const pageSlide = {
    ...slide,
    __typename: "ContentfulSimplePage",
    cta: null,
    path: null,
    slug: "",
    date: "",
    rawDate: ""
  } as PageInfoData;

  it("should return data with video type", () => {
    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(result[0].media).toEqual({
      "data-testid": "hero-video",
      embedHeight: 0,
      embedWidth: 0,
      label: "label",
      layout: "dialog",
      previewImageSource: "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg",
      subtitle: null,
      videoUrl: "https://www.youtube.com/watch?v=youtubeId"
    });
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data with image type", () => {
    slide.featuredVideo = null;
    slide.featuredMedia = createImageData();

    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(result[0].media).toEqual({
      alt: "Image alt text",
      className: undefined,
      component: GatsbyImage,
      "data-testid": "hero-image",
      draggable: false,
      image: {
        backgroundColor: "#484848",
        height: 720,
        images: {
          fallback: {
            sizes: "(min-width: 948px) 948px, 100vw",
            src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
            srcSet:
              "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w"
          },
          sources: [
            {
              sizes: "(min-width: 948px) 948px, 100vw",
              srcSet:
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
              type: "image/webp"
            }
          ]
        },
        layout: "constrained",
        width: 948
      },
      loading: "eager",
      objectFit: "cover",
      objectPosition: "0% 0%"
    });
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data without cta prop", () => {
    const result = getHeroItemsWithContext(context, [
      { ...pageSlide, cta: null, path: null }
    ]);
    expect(result[0].cta).toBeFalsy();
  });

  it("should call getMicroCopy function if slide __typename is not ContentfulPromo", () => {
    const cta: LinkData = {
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
    };

    getHeroItemsWithContext(context, [{ ...pageSlide, cta }]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });

  it("should call getMicroCopy function if slide doesn't have cta", () => {
    slide.cta = null;
    slide.__typename = "ContentfulPromo";

    getHeroItemsWithContext(context, [slide]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });
});
