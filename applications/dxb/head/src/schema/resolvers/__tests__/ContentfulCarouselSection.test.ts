import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import createContentfulInfoPageData from "../types/helpers/ContentfulPageInfoDataHelper";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import createContentfulCarouselSection from "../types/helpers/ContentfulCarouselSection";
import resolveCarouselSection from "../ContentfulCarouselSection";
import type { ContentfulPromo } from "../types/Promo";
import type { ContentfulPageInfoCardData } from "../types/PageInfoCardData";
import type { ContentfulLink } from "../types/Link";

const linkResolverMock = jest.fn();
jest.mock("../ContentfulLink", () => ({
  __esModule: true,
  default: (link: ContentfulLink) => linkResolverMock(link)
}));

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
  linkResolverMock.mockResolvedValue("link");
  promoResolverMock.mockResolvedValue("promo");
  infoPageResolverMock.mockResolvedValue("info-page-data");
});

describe("ContentfulCarouselSection resolver", () => {
  it("Returns correct data when only promo slides provided", async () => {
    const data = createContentfulCarouselSection({
      slidesCollection: {
        items: [createContentfulPromoData()]
      }
    });
    const resolvedData = await resolveCarouselSection(data);

    expect(resolvedData).toEqual({
      __typename: "CarouselSection",
      title: "Title",
      slides: ["promo"],
      link: "link",
      variant: "vertical"
    });
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.slidesCollection.items[0]
    );
  });

  it("Returns correct data when only info page slides provided", async () => {
    const data = createContentfulCarouselSection({
      slidesCollection: {
        items: [createContentfulInfoPageData()]
      }
    });
    const resolvedData = await resolveCarouselSection(data);

    expect(resolvedData).toEqual({
      __typename: "CarouselSection",
      title: "Title",
      slides: ["info-page-data"],
      link: "link",
      variant: "vertical"
    });
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.slidesCollection.items[0]
    );
  });

  it("Returns correct data when all fields provided", async () => {
    const data = createContentfulCarouselSection({
      __typename: "CarouselSection",
      title: "Title",
      slidesCollection: {
        items: [createContentfulInfoPageData(), createContentfulPromoData()]
      },
      link: createContentfulLink(),
      variant: "vertical"
    });
    const resolvedData = await resolveCarouselSection(data);

    expect(resolvedData).toEqual({
      __typename: "CarouselSection",
      title: "Title",
      slides: ["info-page-data", "promo"],
      link: "link",
      variant: "vertical"
    });
    expect(linkResolverMock).toHaveBeenCalledWith(data.link);
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.slidesCollection.items[0]
    );
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.slidesCollection.items[1]
    );
  });

  it("Throws an error if promo resolver fails", async () => {
    const error = new Error("Promo resolver failed");
    promoResolverMock.mockRejectedValue(error);

    await expect(
      resolveCarouselSection(
        createContentfulCarouselSection({
          slidesCollection: { items: [createContentfulPromoData()] }
        })
      )
    ).rejects.toThrow(error);
  });

  it("Throws an error if info page resolver fails", async () => {
    const error = new Error("Info page resolver failed");
    infoPageResolverMock.mockRejectedValue(error);

    await expect(
      resolveCarouselSection(
        createContentfulCarouselSection({
          slidesCollection: { items: [createContentfulInfoPageData()] }
        })
      )
    ).rejects.toThrow(error);
  });

  it("should not call link resolver if link is not provided", async () => {
    const data = await resolveCarouselSection(
      createContentfulCarouselSection({
        link: null
      })
    );

    expect(data.link).toBeNull();
    expect(linkResolverMock).not.toHaveBeenCalled();
  });
});
