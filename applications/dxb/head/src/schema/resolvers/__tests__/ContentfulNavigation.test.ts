import resolveNavigation from "../ContentfulNavigation";
import createContentfulNavigation from "../types/helpers/ContentfulNavigationHelper";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import createNavigationItem from "../../../__tests__/helpers/NavigationItemHelper";
import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import type { ContentfulPromo } from "../types/Promo";
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

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  linkResolverMock.mockResolvedValue("resolved-link");
  promoResolverMock.mockResolvedValue("resolved-promo");
});

describe("ContentfulNavigation resolver", () => {
  it("should not call link resolver and return link as null if not defined", async () => {
    const resolvedNavigation = await resolveNavigation(
      createContentfulNavigation({ link: null, linksCollection: { items: [] } })
    );
    expect(resolvedNavigation.link).toBeNull();
    expect(linkResolverMock).not.toHaveBeenCalled();
  });

  it("should transform link entry if provided", async () => {
    const link = createContentfulLink();
    const resolvedNavigation = await resolveNavigation(
      createContentfulNavigation({ link, linksCollection: { items: [] } })
    );
    expect(resolvedNavigation.link).toBe("resolved-link");
    expect(linkResolverMock).toHaveBeenCalledWith(link);
  });

  it("should not call promo resolver and return null if promosCollection field is not defined", async () => {
    const resolvedNavigation = await resolveNavigation(
      createContentfulNavigation({ promosCollection: null })
    );
    expect(resolvedNavigation.promos).toBeNull();
    expect(promoResolverMock).not.toHaveBeenCalled();
  });

  it("transforms promos correctly if defined", async () => {
    const promo1 = createContentfulPromoData({ title: "Promo 1" });
    const promo2 = createContentfulPromoData({ title: "Promo 2" });
    const resolvedNavigation = await resolveNavigation(
      createContentfulNavigation({
        promosCollection: {
          items: [promo1, promo2]
        }
      })
    );

    expect(resolvedNavigation.promos).toEqual([
      "resolved-promo",
      "resolved-promo"
    ]);
    expect(promoResolverMock).toHaveBeenCalledTimes(2);
    expect(promoResolverMock).toHaveBeenCalledWith(promo1);
    expect(promoResolverMock).toHaveBeenCalledWith(promo2);
  });

  it("throws an error if promo resolver fails", async () => {
    const error = new Error("Promo resolver failed");
    const failedPromo = createContentfulPromoData();
    promoResolverMock.mockRejectedValueOnce(error);

    await expect(
      resolveNavigation(
        createContentfulNavigation({
          promosCollection: {
            items: [failedPromo, createContentfulPromoData()]
          }
        })
      )
    ).rejects.toThrow(error);
  });

  it("should throw an error if link resolver fails", async () => {
    const error = new Error("Link resolver failed");
    const failedLink = createContentfulLink();
    linkResolverMock.mockRejectedValueOnce(error);

    await expect(
      resolveNavigation(
        createContentfulNavigation({
          linksCollection: {
            items: [failedLink, createContentfulLink()]
          },
          link: null
        })
      )
    ).rejects.toThrow(error);
  });

  it("transforms navigation correctly if linksCollection has nested navigation", async () => {
    const navigationEntry = createContentfulNavigation({
      label: "Parent navigation",
      linksCollection: {
        items: [
          createContentfulLink(),
          createNavigationItem({ value: "Parent navigation item" }),
          createContentfulNavigation({
            label: "Child navigation",
            linksCollection: {
              items: [
                createNavigationItem({ value: "Nested navigation item" }),
                createContentfulLink()
              ]
            },
            link: createContentfulLink(),
            promosCollection: { items: [createContentfulPromoData()] }
          })
        ]
      },
      link: null,
      promosCollection: null
    });
    expect(await resolveNavigation(navigationEntry)).toEqual({
      __typename: "Navigation",
      label: "Parent navigation",
      link: null,
      links: [
        "resolved-link",
        {
          __typename: "NavigationItem",
          type: "Heading",
          value: "Parent navigation item"
        },
        {
          __typename: "Navigation",
          label: "Child navigation",
          link: "resolved-link",
          links: [
            {
              __typename: "NavigationItem",
              type: "Heading",
              value: "Nested navigation item"
            },
            "resolved-link"
          ],
          promos: ["resolved-promo"]
        }
      ],
      promos: null
    });
  });

  it("transforms navigation correctly if all the allowed fields provided", async () => {
    const navigationEntry = createContentfulNavigation({
      __typename: "Navigation",
      label: "Navigation label",
      link: createContentfulLink(),
      linksCollection: {
        items: [createContentfulLink(), createNavigationItem()]
      },
      promosCollection: {
        items: [createContentfulPromoData()]
      }
    });

    expect(await resolveNavigation(navigationEntry)).toEqual({
      __typename: "Navigation",
      label: "Navigation label",
      link: "resolved-link",
      links: [
        "resolved-link",
        {
          __typename: "NavigationItem",
          type: "Heading",
          value: "Heading value"
        }
      ],
      promos: ["resolved-promo"]
    });
  });
});
