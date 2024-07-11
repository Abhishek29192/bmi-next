import resolveCardCollectionSection from "../ContentfulCardCollectionSection";
import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import createContentfulCardCollectionSection from "../types/helpers/ContentfulCarCollectionSection";
import createContentfulInfoPageData from "../types/helpers/ContentfulPageInfoDataHelper";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import type { ContentfulPromo } from "../types/Promo";
import type { ContentfulPageInfoCardData } from "../types/PageInfoCardData";
import type { ContentfulLink } from "../types/Link";
import type { ContentfulRichText } from "../types/RichText";

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

const richTextResolver = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => richTextResolver(richText)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  linkResolverMock.mockResolvedValue("link");
  promoResolverMock.mockResolvedValue("promo");
  infoPageResolverMock.mockResolvedValue("info-page-data");
  richTextResolver.mockResolvedValue("rich-text");
});

describe("ContentfulCardCollectionSection resolver", () => {
  it("Returns correct data when only promo slides provided", async () => {
    const data = createContentfulCardCollectionSection({
      cardsCollection: {
        items: [createContentfulPromoData()]
      }
    });
    const resolvedData = await resolveCardCollectionSection(data);

    expect(resolvedData).toEqual({
      __typename: "CardCollectionSection",
      title: null,
      description: null,
      cardType: "Highlight Card",
      cardLabel: null,
      groupCards: null,
      cards: ["promo"],
      sortOrder: null,
      link: null,
      justifyCenter: null,
      displaySingleRow: null
    });
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.cardsCollection.items[0]
    );
  });

  it("Returns correct data when only info page slides provided", async () => {
    const data = createContentfulCardCollectionSection({
      cardsCollection: {
        items: [createContentfulInfoPageData()]
      }
    });
    const resolvedData = await resolveCardCollectionSection(data);

    expect(resolvedData).toEqual({
      __typename: "CardCollectionSection",
      title: null,
      description: null,
      cardType: "Highlight Card",
      cardLabel: null,
      groupCards: null,
      cards: ["info-page-data"],
      sortOrder: null,
      link: null,
      justifyCenter: null,
      displaySingleRow: null
    });
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.cardsCollection.items[0]
    );
  });

  it("Returns correct data when all fields provided", async () => {
    const data = createContentfulCardCollectionSection({
      __typename: "CardCollectionSection",
      title: "Title",
      description: createContentfulRichText(),
      cardType: "Highlight Card",
      cardLabel: "Card label",
      groupCards: true,
      cardsCollection: {
        items: [createContentfulInfoPageData(), createContentfulPromoData()]
      },
      sortOrder: "Default (Contentful)",
      link: createContentfulLink(),
      justifyCenter: false,
      displaySingleRow: false
    });
    const resolvedData = await resolveCardCollectionSection(data);

    expect(resolvedData).toEqual({
      __typename: "CardCollectionSection",
      title: "Title",
      description: "rich-text",
      cardType: "Highlight Card",
      cardLabel: "Card label",
      groupCards: true,
      cards: ["info-page-data", "promo"],
      sortOrder: "Default (Contentful)",
      link: "link",
      justifyCenter: false,
      displaySingleRow: false
    });
    expect(linkResolverMock).toHaveBeenCalledWith(data.link);
    expect(richTextResolver).toHaveBeenCalledWith(data.description);
    expect(infoPageResolverMock).toHaveBeenCalledWith(
      data.cardsCollection.items[0]
    );
    expect(promoResolverMock).toHaveBeenCalledWith(
      data.cardsCollection.items[1]
    );
  });

  it("Throws an error if promo resolver fails", async () => {
    const error = new Error("Promo resolver failed");
    promoResolverMock.mockRejectedValue(error);

    await expect(
      resolveCardCollectionSection(
        createContentfulCardCollectionSection({
          cardsCollection: { items: [createContentfulPromoData()] }
        })
      )
    ).rejects.toThrow(error);
  });

  it("Throws an error if info page resolver fails", async () => {
    const error = new Error("Info page resolver failed");
    infoPageResolverMock.mockRejectedValue(error);

    await expect(
      resolveCardCollectionSection(
        createContentfulCardCollectionSection({
          cardsCollection: { items: [createContentfulInfoPageData()] }
        })
      )
    ).rejects.toThrow(error);
  });

  it("should not call link resolver if link is not provided", async () => {
    await resolveCardCollectionSection(
      createContentfulCardCollectionSection({
        link: null
      })
    );

    expect(linkResolverMock).not.toHaveBeenCalled();
  });

  it("should not call rich text resolver if description is not provided", async () => {
    await resolveCardCollectionSection(
      createContentfulCardCollectionSection({
        description: null
      })
    );

    expect(richTextResolver).not.toHaveBeenCalled();
  });
});
