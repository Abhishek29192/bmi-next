import { microCopy } from "@bmi/microcopies";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import Image from "../../components/Image";
import { DataTypeEnum, Data as LinkData } from "../../components/Link";
import { Data as SlideData } from "../../components/Promo";
import { Context as SiteContext } from "../../components/Site";
import Video, { ContentfulVideoData } from "../../components/Video";
import { getMockSiteContext } from "../../components/__tests__/utils/SiteContextProvider";
import { getHeroItemsWithContext } from "../helpers/getHeroItemsWithContext";
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
    expect(result[0].media).toEqual(
      <Video {...featuredVideo} data-testid={"hero-video"} />
    );
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data with image type", () => {
    slide.featuredVideo = null;
    slide.featuredMedia = createImageData();

    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(result[0].media).toEqual(
      <Image
        {...slide.featuredMedia}
        size="cover"
        data-testid={"hero-image"}
        loading="eager"
      />
    );
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
