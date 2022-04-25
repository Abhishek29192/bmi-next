import React from "react";
import { generateHeroLevel, generateHeroProps } from "../heroLevelUtils";
import { Data as LinkData, DataTypeEnum } from "../../components/Link";
import {
  ContentfulVideoData,
  renderVideo as mockRenderVideo
} from "../../components/Video";
import { Data as ImageData } from "../../components/Image";

jest.mock("../../components/Video", () => ({
  ...(jest.requireActual("../../components/Video") as any),
  renderVideo: jest.fn()
}));

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

const featuredMedia: ImageData = {
  __typename: "ContentfulImage",
  type: null,
  altText: "Lorem ipsum",
  caption: null,
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
  youtubeId: "TDNEwZbm_Nk",
  previewMedia: null,
  videoRatio: null
};

describe("generateHeroLevel test", () => {
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
      "heroSubtitle",
      null,
      featuredMedia,
      cta
    );
    expect(result).toEqual(
      expect.objectContaining({
        title: "heroTitle",
        children: "heroSubtitle"
      })
    );

    expect(result.media.props).toEqual(
      expect.objectContaining({
        src: "//images.asset.jpg",
        alt: "Lorem ipsum"
      })
    );

    expect((result.cta as React.ReactElement).props).toEqual(
      expect.objectContaining({
        children: "ImALink"
      })
    );
  });

  it("generate props with video", () => {
    const result = generateHeroProps(
      "heroTitle",
      "heroSubtitle",
      featureVideo,
      null,
      cta
    );
    expect(result).toEqual(
      expect.objectContaining({
        title: "heroTitle",
        children: "heroSubtitle"
      })
    );

    expect(mockRenderVideo).toBeCalledWith(featureVideo);

    expect((result.cta as React.ReactElement).props).toEqual(
      expect.objectContaining({
        children: "ImALink"
      })
    );
  });
});
