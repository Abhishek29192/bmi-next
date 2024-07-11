import { unstable_cache as original_unstable_cache } from "next/cache";
import * as navigationFetchers from "../navigation";
import originalGetContentfulData from "../../../utils/getContentfulData";
import createContentfulNavigation from "../../../schema/resolvers/types/helpers/ContentfulNavigationHelper";
import createContentfulLink from "../../../schema/resolvers/types/helpers/ContentfulLinkHelper";
import {
  menuNavigationTopLevelQuery,
  nestedNavigationItem,
  nestedNavigationItemWithPromo
} from "../../../schema/queries/menuNavigationQuery";
import createNavigationItem from "../../../__tests__/helpers/NavigationItemHelper";
import type { NavigationData } from "../../../components/link/types";

const { getContentfulMenuNavigation, getMenuNavigationData } =
  navigationFetchers;

jest.mock("next/cache", () => ({
  unstable_cache: (cb: Parameters<typeof original_unstable_cache>[0]) => cb
}));

const getContentfulDataMock = jest.fn();
jest.mock("../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

const resolveNavigationMock = jest.fn();
jest.mock("../../../schema/resolvers/ContentfulNavigation", () => ({
  __esModule: true,
  default: (navigation: NavigationData) => resolveNavigationMock(navigation)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveNavigationMock.mockResolvedValue("resolved-navigation");
});

describe("getMenuNavigationData", () => {
  const getContentfulMenuNavigationMock = jest.spyOn(
    navigationFetchers,
    "getContentfulMenuNavigation"
  );

  it("returns null if getContentfulMenuNavigationMock returns undefined", async () => {
    getContentfulMenuNavigationMock.mockResolvedValue(undefined);
    expect(await getMenuNavigationData()).toBeNull();
  });

  it("throws an error if getContentfulMenuNavigationMock fails", async () => {
    const error = new Error("Did not manage to get contentful navigation data");
    getContentfulMenuNavigationMock.mockRejectedValue(error);
    await expect(getMenuNavigationData()).rejects.toThrow(error);
  });

  it("returns resolved navigation", async () => {
    const navigation = createContentfulNavigation();
    getContentfulMenuNavigationMock.mockResolvedValue(navigation);
    expect(await getMenuNavigationData()).toBe("resolved-navigation");
    expect(resolveNavigationMock).toHaveBeenCalledWith(navigation);
  });
});

describe("getContentfulMenuNavigation", () => {
  it("throws an error if contentful GraphQL request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    getContentfulDataMock.mockResolvedValue({ errors });
    await expect(getContentfulMenuNavigation()).rejects.toThrow(
      JSON.stringify(errors)
    );
  });

  it("returns undefined  and logs a corresponding error message if getContentfulData fails", async () => {
    const error = new Error("getContentfulData failed");
    getContentfulDataMock.mockRejectedValue(error);
    await expect(getContentfulMenuNavigation()).rejects.toThrow(error);
  });

  it("returns correct data and sends a correct request to get nested data", async () => {
    const link = createContentfulLink();
    const navigationItem = {
      ...createNavigationItem(),
      sys: { id: "navigation-item-id" }
    };
    const navigation = createContentfulNavigation({
      linksCollection: {
        items: [link, navigationItem]
      }
    });

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...navigation,
                  linksCollection: {
                    items: [
                      { sys: { id: link.sys.id } },
                      { sys: { id: navigationItem.sys.id } }
                    ]
                  }
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({ data: { entryCollection: { items: [link] } } })
      .mockResolvedValueOnce({
        data: { entryCollection: { items: [navigationItem] } }
      });

    expect(await getContentfulMenuNavigation()).toEqual({
      ...navigation,
      promosCollection: null
    });
    expect(getContentfulDataMock).toHaveBeenCalledTimes(3);
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      menuNavigationTopLevelQuery,
      { countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: link.sys.id }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: navigationItem.sys.id }
    );
  });

  it("throws an error if a request for nested item fails", async () => {
    const link = createContentfulLink();
    const navigation = createContentfulNavigation({
      linksCollection: {
        items: [link]
      }
    });
    const error = new Error("Nested item request failed");

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...navigation,
                  linksCollection: { items: [{ sys: { id: link.sys.id } }] }
                }
              }
            ]
          }
        }
      })
      .mockRejectedValueOnce(error);

    await expect(getContentfulMenuNavigation()).rejects.toThrow(error);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      menuNavigationTopLevelQuery,
      { countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: link.sys.id }
    );
  });

  it("throws an error if a request for nested item returns an array of errors", async () => {
    const link = createContentfulLink();
    const navigation = createContentfulNavigation({
      linksCollection: {
        items: [link]
      }
    });
    const errors = ["error-1", "error-2"];

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...navigation,
                  linksCollection: { items: [{ sys: { id: link.sys.id } }] }
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({ errors });

    await expect(getContentfulMenuNavigation()).rejects.toThrow(
      JSON.stringify(errors)
    );
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      menuNavigationTopLevelQuery,
      { countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: link.sys.id }
    );
  });

  it("returns correct data if there are multiple levels of nesting", async () => {
    const link = createContentfulLink();
    const navigationItem = {
      ...createNavigationItem(),
      sys: { id: "navigation-item-id" }
    };
    const nestedNavigation = createContentfulNavigation({
      linksCollection: { items: [navigationItem] }
    });
    const parentNavigation = createContentfulNavigation({
      linksCollection: {
        items: [link, nestedNavigation]
      }
    });

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...parentNavigation,
                  linksCollection: {
                    items: [
                      { sys: { id: link.sys.id } },
                      { sys: { id: nestedNavigation.sys.id } }
                    ]
                  }
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({ data: { entryCollection: { items: [link] } } })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...nestedNavigation,
                linksCollection: {
                  items: [{ sys: { id: navigationItem.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: { entryCollection: { items: [navigationItem] } }
      });

    expect(await getContentfulMenuNavigation()).toEqual({
      ...parentNavigation,
      promosCollection: null
    });
    expect(getContentfulDataMock).toHaveBeenCalledTimes(4);
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      menuNavigationTopLevelQuery,
      { countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: link.sys.id }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: nestedNavigation.sys.id }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(nestedNavigationItem, {
      navigationItemId: navigationItem.sys.id
    });
  });

  it("throws an error if a request on second level of nesting fails", async () => {
    const link = createContentfulLink();
    const navigationItem = {
      ...createNavigationItem(),
      sys: { id: "navigation-item-id" }
    };
    const nestedNavigation = createContentfulNavigation({
      linksCollection: { items: [navigationItem] }
    });
    const parentNavigation = createContentfulNavigation({
      linksCollection: {
        items: [link, nestedNavigation]
      }
    });
    const error = new Error("Nested navigation item error");

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...parentNavigation,
                  linksCollection: {
                    items: [
                      { sys: { id: link.sys.id } },
                      { sys: { id: nestedNavigation.sys.id } }
                    ]
                  }
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({ data: { entryCollection: { items: [link] } } })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...nestedNavigation,
                linksCollection: {
                  items: [{ sys: { id: navigationItem.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockRejectedValueOnce(error);

    await expect(getContentfulMenuNavigation()).rejects.toThrow(error);
    expect(getContentfulDataMock).toHaveBeenCalledTimes(4);
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      menuNavigationTopLevelQuery,
      { countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: link.sys.id }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(
      nestedNavigationItemWithPromo,
      { navigationItemId: nestedNavigation.sys.id }
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(nestedNavigationItem, {
      navigationItemId: navigationItem.sys.id
    });
  });

  it("should take into account only first 5 levels of nesting", async () => {
    const navigation6 = createContentfulNavigation({
      sys: { id: "navigation-6" },
      linksCollection: {
        items: [createContentfulLink()]
      }
    });
    const navigation5 = createContentfulNavigation({
      sys: { id: "navigation-5" },
      linksCollection: {
        items: [navigation6]
      }
    });
    const navigation4 = createContentfulNavigation({
      sys: { id: "navigation-4" },
      linksCollection: {
        items: [navigation5]
      }
    });
    const navigation3 = createContentfulNavigation({
      sys: { id: "navigation-3" },
      linksCollection: {
        items: [navigation4]
      }
    });
    const navigation2 = createContentfulNavigation({
      sys: { id: "navigation-2" },
      linksCollection: {
        items: [navigation3]
      }
    });
    const navigation1 = createContentfulNavigation({
      sys: { id: "navigation-1" },
      linksCollection: {
        items: [navigation2]
      }
    });
    const menuNavigation = createContentfulNavigation({
      sys: { id: "menu-navigation" },
      linksCollection: {
        items: [navigation1]
      }
    });

    getContentfulDataMock
      .mockResolvedValueOnce({
        data: {
          siteCollection: {
            items: [
              {
                menuNavigation: {
                  ...menuNavigation,
                  linksCollection: {
                    items: [{ sys: { id: navigation1.sys.id } }]
                  }
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...navigation1,
                linksCollection: {
                  items: [{ sys: { id: navigation2.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...navigation2,
                linksCollection: {
                  items: [{ sys: { id: navigation3.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...navigation3,
                linksCollection: {
                  items: [{ sys: { id: navigation4.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...navigation4,
                linksCollection: {
                  items: [{ sys: { id: navigation5.sys.id } }]
                }
              }
            ]
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          entryCollection: {
            items: [
              {
                ...navigation5,
                linksCollection: {
                  items: [{ sys: { id: navigation5.sys.id } }]
                }
              }
            ]
          }
        }
      });

    expect(await getContentfulMenuNavigation()).toEqual({
      ...menuNavigation,
      linksCollection: {
        items: [
          {
            ...navigation1,
            linksCollection: {
              items: [
                {
                  ...navigation2,
                  linksCollection: {
                    items: [
                      {
                        ...navigation3,
                        linksCollection: {
                          items: [
                            {
                              ...navigation4,
                              linksCollection: {
                                items: [
                                  {
                                    ...navigation5,
                                    linksCollection: { items: [] }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      promosCollection: null
    });
  });
});
