import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { Data as PageInfoData } from "../../../components/PageInfo";
import { Data as PromoData } from "../../../components/Promo";
import { ContentfulVideoData } from "../../../components/Video";
import { createMockSiteData } from "../../../test/mockSiteData";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { PdpCardsSection } from "../components/pdp-cards";

const { resources: mockResources, countryCode } = createMockSiteData();

const createMockVideo = (
  mockVideo?: Partial<ContentfulVideoData>
): ContentfulVideoData => ({
  __typename: "ContentfulVideo",
  title: "",
  label: "mockLabel",
  subtitle: null,
  videoUrl: "https://www.youtube.com/watch?v=testId",
  videoRatio: null,
  previewMedia: null,
  defaultYouTubePreviewImage: "https://i.ytimg.com/vi/testId/maxresdefault.jpg",
  ...mockVideo
});

const createCard = (includeVideo = false): PromoData | PageInfoData => {
  return {
    __typename: "ContentfulProductListerPage",
    id: "4f6c8de7-22be-5631-b334-024ca098ae57",
    title: "Zanda Arktis ",
    subtitle:
      "Zanda Arctic is our most durable concrete roof tile. To make the roof tile really durable and resistant to weather and wind, we have cast in quartz and color pigments. Then we painted it twice.",
    brandLogo: "Zanda",
    slug: "zanda-arktis",
    path: "zanda-arktis/",
    tags: null,
    featuredVideo: includeVideo && createMockVideo(),
    featuredMedia: createImageData(),
    date: "",
    rawDate: null
  };
};

describe("PdpCardsSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render correctly", () => {
    const card = createCard();
    const { baseElement } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [card],
            pdpCardsTitle: mockResources.pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("should render CTACard with video", () => {
    const card = createCard(true);
    const { baseElement } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [card],
            pdpCardsTitle: mockResources.pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
