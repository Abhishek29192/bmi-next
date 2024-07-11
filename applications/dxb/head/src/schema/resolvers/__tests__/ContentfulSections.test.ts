import resolveSections from "../ContentfulSections";
import createContentfulCarouselSection from "../types/helpers/ContentfulCarouselSection";
import createContentfulCardCollectionSection from "../types/helpers/ContentfulCarCollectionSection";
import createEmbeddedScriptSection from "../../../__tests__/helpers/EmbeddedScriptSectionHelper";
import createContentfulIframeSection from "../types/helpers/ContentfulIframeSectionHelper";
import createContentfulLeadBlock from "../types/helpers/ContentfulLeadBlockHelper";
import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import createContentfulServiceLocatorSection from "../types/helpers/ContentfulServiceLocatorSectionHelper";
import createContentfulSignUpBlock from "../types/helpers/ContentfulSignUpBlockHelper";
import createContentfulTitleWithContent from "../types/helpers/ContentfulTitleWithContent";
import createContentfulVideoSection from "../types/helpers/ContentfulVideoSectionHelper";
import createContentfulSyndicateSection from "../types/helpers/ContentfulSyndicateSectionHelper";
import type { ContentfulCardCollection } from "../types/CardCollection";
import type { ContentfulCarouselSection } from "../types/CarouselSection";
import type { ContentfulLeadBlock } from "../types/LeadBlock";
import type { ContentfulIframeSectionData } from "../types/IframeSection";
import type { ContentfulPromo } from "../types/Promo";
import type { ContentfulSignUpBlockData } from "../types/SignUpBlock";
import type { ContentfulTitleWithContentData } from "../types/TitleWithContent";
import type { ContentfulVideoSectionData } from "../types/VideoSection";
import type { ContentfulSyndicateSectionData } from "../types/SyndicateSection";
import type { ContentfulServiceLocatorData } from "../types/ServiceLocatorSection";
import type { ContentfulSections } from "../types/Sections";

const resolveCardCollectionSectionMock = jest.fn();
jest.mock("../ContentfulCardCollectionSection", () => ({
  __esModule: true,
  default: (cardCollection: ContentfulCardCollection) =>
    resolveCardCollectionSectionMock(cardCollection)
}));

const resolveCarouselSectionMock = jest.fn();
jest.mock("../ContentfulCarouselSection", () => ({
  __esModule: true,
  default: (carouselSection: ContentfulCarouselSection) =>
    resolveCarouselSectionMock(carouselSection)
}));

const resolveLeadBlockMock = jest.fn();
jest.mock("../ContentfulLeadBlock", () => ({
  __esModule: true,
  default: (leadBlock: ContentfulLeadBlock) => resolveLeadBlockMock(leadBlock)
}));

const resolveIframeSectionMock = jest.fn();
jest.mock("../ContentfulIframeSection", () => ({
  __esModule: true,
  default: (iframeSection: ContentfulIframeSectionData) =>
    resolveIframeSectionMock(iframeSection)
}));

const resolvePromoMock = jest.fn();
jest.mock("../ContentfulPromo", () => ({
  __esModule: true,
  default: (promo: ContentfulPromo) => resolvePromoMock(promo)
}));

const resolveSignUpBlockMock = jest.fn();
jest.mock("../ContentfulSignUpBlock", () => ({
  __esModule: true,
  default: (signUpBlock: ContentfulSignUpBlockData) =>
    resolveSignUpBlockMock(signUpBlock)
}));

const resolveTitleWithContentMock = jest.fn();
jest.mock("../ContentfulTitleWithContent", () => ({
  __esModule: true,
  default: (titleWithContent: ContentfulTitleWithContentData) =>
    resolveTitleWithContentMock(titleWithContent)
}));

const resolveVideoSectionMock = jest.fn();
jest.mock("../ContentfulVideoSection", () => ({
  __esModule: true,
  default: (videoSection: ContentfulVideoSectionData) =>
    resolveVideoSectionMock(videoSection)
}));

const resolveSyndicateSectionMock = jest.fn();
jest.mock("../ContentfulSyndicateSection", () => ({
  __esModule: true,
  default: (syndicateSection: ContentfulSyndicateSectionData) =>
    resolveSyndicateSectionMock(syndicateSection)
}));

const resolveServiceLocatorMock = jest.fn();
jest.mock("../ContentfulServiceLocatorSection", () => ({
  __esModule: true,
  default: (serviceLocator: ContentfulServiceLocatorData) =>
    resolveServiceLocatorMock(serviceLocator)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveCardCollectionSectionMock.mockResolvedValue(
    "resolved-card-collection-section"
  );
  resolveCarouselSectionMock.mockResolvedValue("resolved-carousel-section");
  resolveLeadBlockMock.mockResolvedValue("resolved-lead-block");
  resolveIframeSectionMock.mockResolvedValue("resolved-iframe-section");
  resolvePromoMock.mockResolvedValue("resolved-promo");
  resolveSignUpBlockMock.mockResolvedValue("resolved-sign-up-block");
  resolveTitleWithContentMock.mockResolvedValue("resolved-title-with-content");
  resolveVideoSectionMock.mockResolvedValue("resolved-video-section");
  resolveSyndicateSectionMock.mockResolvedValue("resolved-syndicate-section");
  resolveServiceLocatorMock.mockResolvedValue(
    "resolved-service-locator-section"
  );
});

describe("ContentfulSections resolver", () => {
  describe("CardCollectionSection", () => {
    it("should return resolved card collection section", async () => {
      expect(
        await resolveSections([createContentfulCardCollectionSection()])
      ).toEqual(["resolved-card-collection-section"]);
    });

    it("throws an error if card collection resolver fails", async () => {
      const error = new Error("Card collection section resolver failed");
      resolveCardCollectionSectionMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulCardCollectionSection()])
      ).rejects.toThrow(error);
    });
  });

  describe("CarouselSection", () => {
    it("should return resolved carousel section", async () => {
      expect(
        await resolveSections([createContentfulCarouselSection()])
      ).toEqual(["resolved-carousel-section"]);
    });

    it("should skip a section and log a corresponding error if carousel section resolver fails", async () => {
      const error = new Error("Carousel section resolver failed");
      resolveCarouselSectionMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulCarouselSection()])
      ).rejects.toThrow(error);
    });
  });

  describe("EmbeddedScriptSection", () => {
    it("should not apply any transformations to EmbeddedScriptSection", async () => {
      const embeddedScriptSection = createEmbeddedScriptSection();
      expect(await resolveSections([embeddedScriptSection])).toEqual([
        embeddedScriptSection
      ]);
    });
  });

  describe("IframeSection", () => {
    it("should return resolved iframe section", async () => {
      expect(await resolveSections([createContentfulIframeSection()])).toEqual([
        "resolved-iframe-section"
      ]);
    });

    it("throws an error if iframe section resolver fails", async () => {
      const error = new Error("Iframe section resolver failed");
      resolveIframeSectionMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulIframeSection()])
      ).rejects.toThrow(error);
    });
  });

  describe("LeadBlockSection", () => {
    it("should return resolved lead block section", async () => {
      expect(await resolveSections([createContentfulLeadBlock()])).toEqual([
        "resolved-lead-block"
      ]);
    });

    it("should skip a section and log a corresponding error if lead block section resolver fails", async () => {
      const error = new Error("Lead block section resolver failed");
      resolveLeadBlockMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulLeadBlock()])
      ).rejects.toThrow(error);
    });
  });

  describe("Promo", () => {
    it("should return resolved promo", async () => {
      expect(await resolveSections([createContentfulPromoData()])).toEqual([
        "resolved-promo"
      ]);
    });

    it("should skip a section and log a corresponding error if promo resolver fails", async () => {
      const error = new Error("Promo resolver failed");
      resolvePromoMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulPromoData()])
      ).rejects.toThrow(error);
    });
  });

  describe("ServiceLocatorSection", () => {
    it("should return resolved service locator section", async () => {
      expect(
        await resolveSections([createContentfulServiceLocatorSection()])
      ).toEqual(["resolved-service-locator-section"]);
    });

    it("should skip a section and log a corresponding error if service locator section resolver fails", async () => {
      const error = new Error("Service locator section resolver failed");
      resolveServiceLocatorMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulServiceLocatorSection()])
      ).rejects.toThrow(error);
    });
  });

  describe("SignupBlock", () => {
    it("should return resolved sign up block", async () => {
      expect(await resolveSections([createContentfulSignUpBlock()])).toEqual([
        "resolved-sign-up-block"
      ]);
    });

    it("should skip a section and log a corresponding error if sign up block resolver fails", async () => {
      const error = new Error("Service locator section resolver failed");
      resolveSignUpBlockMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulSignUpBlock()])
      ).rejects.toThrow(error);
    });
  });

  describe("TitleWithContent", () => {
    it("should return resolved title with content section", async () => {
      expect(
        await resolveSections([createContentfulTitleWithContent()])
      ).toEqual(["resolved-title-with-content"]);
    });

    it("should skip a section and log a corresponding error if title with content section resolver fails", async () => {
      const error = new Error("Title with content section resolver failed");
      resolveTitleWithContentMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulTitleWithContent()])
      ).rejects.toThrow(error);
    });
  });

  describe("VideoSection", () => {
    it("should return resolved video section", async () => {
      expect(await resolveSections([createContentfulVideoSection()])).toEqual([
        "resolved-video-section"
      ]);
    });

    it("should skip a section and log a corresponding error if video section resolver fails", async () => {
      const error = new Error("Video section resolver failed");
      resolveVideoSectionMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulVideoSection()])
      ).rejects.toThrow(error);
    });
  });

  describe("SyndicateSection", () => {
    it("should return resolved syndicate section", async () => {
      expect(
        await resolveSections([createContentfulSyndicateSection()])
      ).toEqual(["resolved-syndicate-section"]);
    });

    it("should skip a section and log a corresponding error if syndicate section resolver fails", async () => {
      const error = new Error("Syndicate section resolver failed");
      resolveSyndicateSectionMock.mockRejectedValue(error);

      await expect(
        resolveSections([createContentfulSyndicateSection()])
      ).rejects.toThrow(error);
    });
  });

  it("should return correct data if all the allowed sections provided", async () => {
    const sections: ContentfulSections = [
      createContentfulCardCollectionSection(),
      createContentfulCarouselSection(),
      createEmbeddedScriptSection(),
      createContentfulIframeSection(),
      createContentfulLeadBlock(),
      createContentfulPromoData(),
      createContentfulServiceLocatorSection(),
      createContentfulSignUpBlock(),
      createContentfulTitleWithContent(),
      createContentfulVideoSection(),
      createContentfulSyndicateSection()
    ];

    expect(await resolveSections(sections)).toEqual([
      "resolved-card-collection-section",
      "resolved-carousel-section",
      createEmbeddedScriptSection(),
      "resolved-iframe-section",
      "resolved-lead-block",
      "resolved-promo",
      "resolved-service-locator-section",
      "resolved-sign-up-block",
      "resolved-title-with-content",
      "resolved-video-section",
      "resolved-syndicate-section"
    ]);
  });

  it("should skip a section if it is not in the list of allowed sections", async () => {
    expect(
      await resolveSections([
        { __typename: "FakeContentType", title: "Title" } as any
      ])
    ).toEqual([]);
  });
});
