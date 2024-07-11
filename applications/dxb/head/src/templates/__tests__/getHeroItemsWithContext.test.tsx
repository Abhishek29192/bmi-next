import NextImage from "next/image";
import { microCopy } from "@bmi/microcopies";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { Context as SiteContext } from "../../components/Site";
import { getMockSiteContext } from "../../components/__tests__/utils/SiteContextProvider";
import { DataTypeEnum } from "../../components/link/types";
import { getHeroItemsWithContext } from "../helpers/getHeroItemsWithContext";
import type { Data as SlideData } from "../../components/Promo";
import type { Data as VideoData } from "../../components/video/types";
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
  const featuredVideo: VideoData = {
    title: "featuredVideo",
    label: "label",
    subtitle: null,
    videoUrl: "https://www.youtube.com/watch?v=youtubeId",
    previewMedia: null,
    videoRatio: null,
    defaultYouTubePreviewImage:
      "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg",
    previewMediaWidths: [400, 500, 400, 300, 400]
  };

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
    featuredVideo: { __typename: "Video", ...featuredVideo },
    backgroundColor: null
  };

  const pageSlide = {
    ...slide,
    __typename: "Page",
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
      videoUrl: "https://www.youtube.com/watch?v=youtubeId",
      dataGTM: {
        action: "Play",
        id: "cta-click--video-youtube",
        label: "https://www.youtube.com/watch?v=youtubeId-label"
      }
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
      alt: "Alt text",
      className: undefined,
      component: NextImage,
      "data-testid": "hero-image",
      decoding: "async",
      draggable: false,
      fill: true,
      loader: expect.any(Function),
      loading: "eager",
      sizes:
        "(max-width: 599px) 593px, (max-width: 719px) 713px, (max-width: 839px) 408px, (max-width: 1439px) 708px, 988px",
      src: "https:http://localhost:8080/custom-image.jpg",
      style: {
        height: undefined,
        objectFit: "cover",
        objectPosition: "0% 0%",
        width: undefined
      }
    });
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data without cta prop", () => {
    const result = getHeroItemsWithContext(context, [{ ...slide, cta: null }]);
    expect(result[0].cta).toBeFalsy();
  });

  it("should call getMicroCopy function if slide __typename is not Promo", () => {
    getHeroItemsWithContext(context, [pageSlide]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });

  it("should call getMicroCopy function if slide doesn't have cta", () => {
    slide.cta = null;
    slide.__typename = "Promo";

    getHeroItemsWithContext(context, [slide]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });
});
