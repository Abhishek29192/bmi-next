import React from "react";
import { DataTypeEnum } from "../../components/link/types";
import { generateHeroLevel, generateHeroProps } from "../heroLevelUtils";
import type { Data as ContentfulImageData } from "../../components/image/types";
import type { Data as LinkData } from "../../components/link/types";
import type { ContentfulVideoData } from "../../components/video/types";

const mockBreadCrumbs = [
  { id: "id-mock", label: "mock-breadcrumb", slug: "slug-mock" }
];

const cta: LinkData = {
  __typename: "ContentfulLink",
  id: "string",
  label: "ImALink",
  icon: null,
  isLabelHidden: null,
  url: "https://www.external.co.uk",
  linkedPage: null,
  type: DataTypeEnum.Dialog,
  parameters: null,
  dialogContent: null,
  hubSpotCTAID: null
};

const featuredMedia: ContentfulImageData = {
  type: null,
  altText: "Lorem ipsum",
  focalPoint: null,
  image: {
    file: {
      fileName: "Lorem ipsum",
      url: "//images.asset.jpg"
    }
  }
};

const featureVideo: ContentfulVideoData = {
  __typename: "ContentfulVideo",
  title: "video title",
  label: "video label",
  subtitle: "video subtitle",
  videoUrl: "https://youtu.be/TDNEwZbm_Nk",
  previewMedia: null,
  videoRatio: null,
  defaultYouTubePreviewImage:
    "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg"
};

describe("generateHeroLevel test", () => {
  it("returns undefined if heroType is null", () => {
    expect(generateHeroLevel(null, mockBreadCrumbs)).toBeUndefined();
  });
  it("test hero utils with levels types", () => {
    expect(generateHeroLevel("Level 1", mockBreadCrumbs)).toBe(1);
    expect(generateHeroLevel("Level 2", mockBreadCrumbs)).toBe(2);
    expect(generateHeroLevel("Level 3", mockBreadCrumbs)).toBe(3);
  });

  it("test hero utils with Hierarchy or Spotlight type", () => {
    expect(generateHeroLevel("Hierarchy", mockBreadCrumbs)).toBe(1);
    expect(generateHeroLevel("Hierarchy", [])).toBe(1);
    expect(
      generateHeroLevel("Spotlight", [
        ...mockBreadCrumbs,
        { id: "id-mock", label: "mock-breadcrumb", slug: "slug-mock-1" },
        { id: "id-mock", label: "mock-breadcrumb", slug: "slug-mock-2" },
        { id: "id-mock", label: "mock-breadcrumb", slug: "slug-mock-3" }
      ])
    ).toBe(3);
    expect(
      generateHeroLevel("Spotlight", [
        ...mockBreadCrumbs,
        { id: "id-mock", label: "mock-breadcrumb", slug: "slug-mock-1" }
      ])
    ).toBe(2);
  });
});

describe("generateHeroProps test", () => {
  it("generate props with image", () => {
    const result = generateHeroProps(
      "heroTitle",
      1,
      "heroSubtitle",
      null,
      featuredMedia,
      cta
    );
    expect(result).toEqual(
      expect.objectContaining({
        title: "heroTitle",
        level: 1,
        children: "heroSubtitle"
      })
    );

    expect(result.media).toEqual({
      alt: "Lorem ipsum",
      className: undefined,
      "data-testid": undefined,
      loading: "eager",
      src: "//images.asset.jpg",
      style: {
        objectFit: "cover",
        objectPosition: "center"
      }
    });

    expect((result.cta as React.ReactElement).props).toEqual(
      expect.objectContaining({
        children: "ImALink"
      })
    );
  });

  it("generate props with video", () => {
    const result = generateHeroProps(
      "heroTitle",
      1,
      "heroSubtitle",
      featureVideo,
      null,
      cta
    );
    expect(result).toEqual(
      expect.objectContaining({
        title: "heroTitle",
        level: 1,
        children: "heroSubtitle"
      })
    );

    expect(result.media).toEqual({
      "data-testid": undefined,
      embedHeight: 0,
      embedWidth: 0,
      label: featureVideo.label,
      layout: "dialog",
      previewImageSource: featureVideo.defaultYouTubePreviewImage,
      subtitle: featureVideo.subtitle,
      videoUrl: featureVideo.videoUrl,
      dataGTM: {
        action: "Play",
        id: "cta-click--video-youtube",
        label: "https://youtu.be/TDNEwZbm_Nk-video label"
      }
    });

    expect((result.cta as React.ReactElement).props).toEqual(
      expect.objectContaining({
        children: "ImALink"
      })
    );
  });

  it("generate props without any media", () => {
    const result = generateHeroProps(
      "heroTitle",
      1,
      "heroSubtitle",
      null,
      null,
      cta
    );
    expect(result).toEqual(
      expect.objectContaining({
        title: "heroTitle",
        level: 1,
        children: "heroSubtitle"
      })
    );

    expect(result.media).toBeUndefined();

    expect((result.cta as React.ReactElement).props).toEqual(
      expect.objectContaining({
        children: "ImALink"
      })
    );
  });
});
