import resolveSyndicateSection from "../ContentfulSyndicateSection";
import createContentfulSyndicateSection from "../types/helpers/ContentfulSyndicateSectionHelper";
import createContentfulPromo from "../types/helpers/ContentfulPromoHelper";
import createContentfulPageInfoData from "../types/helpers/ContentfulPageInfoDataHelper";
import type { ContentfulPromo } from "../types/Promo";
import type { ContentfulPageInfoCardData } from "../types/PageInfoCardData";

const promoResolverMock = jest.fn();
jest.mock("../ContentfulPromo", () => ({
  __esModule: true,
  default: (promo: ContentfulPromo) => promoResolverMock(promo)
}));

const infoPageResolverMock = jest.fn();
jest.mock("../ContentfulInfoCardData", () => ({
  __esModule: true,
  default: (infoPage: ContentfulPageInfoCardData) =>
    infoPageResolverMock(infoPage)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  promoResolverMock.mockResolvedValue("resolved-promo");
  infoPageResolverMock.mockResolvedValue("resolved-page-info-data");
});

describe("ContentfulSyndicateSection resolver", () => {
  it("Returns correct data when only promo slides provided", async () => {
    const data = createContentfulSyndicateSection({
      villainsCollection: {
        items: [createContentfulPromo()]
      }
    });
    const resolvedData = await resolveSyndicateSection(data);

    expect(resolvedData).toEqual({
      __typename: "VillainSection",
      title: "Title",
      isReversed: false,
      description: "Description",
      villains: ["resolved-promo"]
    });
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.villainsCollection.items[0]
    );
  });

  it("Returns correct data when only page info slides provided", async () => {
    const data = createContentfulSyndicateSection({
      villainsCollection: {
        items: [createContentfulPageInfoData()]
      }
    });
    const resolvedData = await resolveSyndicateSection(data);

    expect(resolvedData).toEqual({
      __typename: "VillainSection",
      title: "Title",
      isReversed: false,
      description: "Description",
      villains: ["resolved-page-info-data"]
    });
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.villainsCollection.items[0]
    );
  });

  it("Returns correct data when all fields provided", async () => {
    const data = createContentfulSyndicateSection({
      __typename: "VillainSection",
      title: "Title",
      isReversed: false,
      syndicateSectionDescription: "Description",
      villainsCollection: {
        items: [createContentfulPromo(), createContentfulPageInfoData()]
      }
    });
    const resolvedData = await resolveSyndicateSection(data);

    expect(resolvedData).toEqual({
      __typename: "VillainSection",
      title: "Title",
      isReversed: false,
      description: "Description",
      villains: ["resolved-promo", "resolved-page-info-data"]
    });
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.villainsCollection.items[0]
    );
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.villainsCollection.items[1]
    );
  });

  it("logs a corresponding error message if promo resolver fails", async () => {
    const error = new Error("Promo resolver failed");
    promoResolverMock.mockRejectedValue(error);

    await expect(
      resolveSyndicateSection(
        createContentfulSyndicateSection({
          villainsCollection: { items: [createContentfulPromo()] }
        })
      )
    ).rejects.toThrow(error);
  });

  it("logs a corresponding error message if info page resolver fails", async () => {
    const error = new Error("Info page resolver failed");
    infoPageResolverMock.mockRejectedValue(error);

    await expect(
      resolveSyndicateSection(
        createContentfulSyndicateSection({
          villainsCollection: { items: [createContentfulPageInfoData()] }
        })
      )
    ).rejects.toThrow(error);
  });
});
