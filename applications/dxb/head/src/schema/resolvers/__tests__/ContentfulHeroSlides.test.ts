import resolveHeroSlides from "../ContentfulHeroSlides";
import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import createContentfulInfoPageData from "../types/helpers/ContentfulPageInfoDataHelper";
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
  promoResolverMock.mockResolvedValue("promo");
  infoPageResolverMock.mockResolvedValue("info-page-data");
});

describe("ContentfulHeroSlides resolver", () => {
  it("Returns correct data when only promo slides provided", async () => {
    const promoSlide = createContentfulPromoData();
    expect(await resolveHeroSlides([promoSlide])).toEqual(["promo"]);
    expect(promoResolverMock).toHaveBeenCalledWith(promoSlide);
  });

  it("Returns correct data when only info page slides provided", async () => {
    const infoSlide = createContentfulInfoPageData();
    expect(await resolveHeroSlides([infoSlide])).toEqual(["info-page-data"]);
    expect(infoPageResolverMock).toHaveBeenCalledWith(infoSlide);
  });

  it("Returns correct data when both promo and info page slides provided", async () => {
    const slides = [
      createContentfulPromoData(),
      createContentfulInfoPageData()
    ];
    expect(await resolveHeroSlides(slides)).toEqual([
      "promo",
      "info-page-data"
    ]);
    expect(promoResolverMock).toHaveBeenCalledWith(slides[0]);
    expect(infoPageResolverMock).toHaveBeenCalledWith(slides[1]);
  });

  it("Throws an error if promo resolver fails", async () => {
    const error = new Error("Promo resolver failed");
    promoResolverMock.mockRejectedValue(error);

    await expect(
      resolveHeroSlides([createContentfulPromoData()])
    ).rejects.toThrow(error);
  });

  it("Throws an error if info page resolver fails", async () => {
    const error = new Error("Info page resolver failed");
    infoPageResolverMock.mockRejectedValue(error);

    await expect(
      resolveHeroSlides([createContentfulInfoPageData()])
    ).rejects.toThrow(error);
  });
});
