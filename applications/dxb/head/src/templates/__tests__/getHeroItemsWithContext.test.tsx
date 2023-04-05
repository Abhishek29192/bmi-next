import React from "react";
import Image from "../../components/Image";
import { DataTypeEnum } from "../../components/Link";
import { Data as SlideData } from "../../components/Promo";
import Video from "../../components/Video";
import { microCopy } from "../../constants/microCopies";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import { getHeroItemsWithContext } from "../helpers/getHeroItemsWithContext";

const context = {
  getMicroCopy: jest.fn()
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("getHeroItemsWithContext", () => {
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

  it("should return data with video type", () => {
    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(result[0].media).toEqual(
      <Video {...slide.featuredVideo} data-testid={"hero-video"} />
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
      <Image {...slide.featuredMedia} size="cover" data-testid={"hero-image"} />
    );
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data without cta prop", () => {
    slide.cta = null;
    slide["path"] = null;

    const result = getHeroItemsWithContext(context, [slide]);

    expect(result[0].cta).toBeFalsy();
  });

  it("should call getMicroCopy function if slide __typename is not ContentfulPromo", () => {
    slide.__typename = null;
    slide.cta = {
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

    getHeroItemsWithContext(context, [slide]);

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
