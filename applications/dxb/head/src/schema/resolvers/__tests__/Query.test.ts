import Query from "../Query";
import { Context, ResolveArgs } from "../types/Gatsby";

const context: Context = {
  nodeModel: {
    findAll: jest.fn().mockResolvedValue({ entries: [] }),
    findOne: jest.fn(),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn()
  }
};

jest.mock("@bmi/utils", () => {
  const originalModule = jest.requireActual("@bmi/utils");

  return {
    ...originalModule,
    generateHashFromString: (name: string) => name
  };
});

let getPlpFilters = jest.fn();
jest.mock("../utils/filters", () => ({
  getPlpFilters: (...args) => getPlpFilters(...args)
}));

const resolveDocumentsFromProducts = jest.fn();
jest.mock("../utils/documents", () => ({
  resolveDocumentsFromProducts: (...args) =>
    resolveDocumentsFromProducts(...args)
}));

const args: ResolveArgs = {
  categoryCodes: ["category-1"],
  allowFilterBy: []
};

describe("Query resolver", () => {
  describe("allPIMDocument", () => {
    it("should contain specific type", () => {
      expect(Query.allPIMDocument.type).toEqual(["PIMDocument"]);
    });
    it("should resolve pim documents without filters", async () => {
      const result = { filters: [], documents: [] };
      resolveDocumentsFromProducts.mockResolvedValue(result);

      expect(await Query.allPIMDocument.resolve(null, null, context)).toEqual(
        []
      );

      expect(resolveDocumentsFromProducts).toHaveBeenCalledWith(
        [],
        {
          source: {},
          context
        },
        null
      );
    });
  });

  describe("plpFilters", () => {
    it("should contain specific type", () => {
      expect(Query.plpFilters.type).toEqual("PLPFilterResponse");
    });
    it("should contain specific query args", () => {
      expect(Query.plpFilters.args).toEqual({
        categoryCodes: "[String!]",
        allowFilterBy: "[String!]"
      });
    });

    it("should handle empty products list", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] })
        .mockResolvedValueOnce({ entries: [] });

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual({
        allowFilterBy: [],
        filters: []
      });

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            categories: { elemMatch: { code: { in: ["category-1"] } } }
          }
        },
        type: "Product"
      });
    });

    it("should run query without filters if not provided", async () => {
      const filters = { allowFilterBy: [], filters: [] };
      getPlpFilters.mockReturnValue([]);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({
          entries: [
            { categories: [{ code: "category-1" }, { code: "category-2" }] }
          ]
        })
        .mockResolvedValueOnce({ entries: [] });
      context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
        microCopy___NODE: ["id1", "id2", "id3"]
      });
      context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" }
      ]);

      expect(
        await Query.plpFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {},
        type: "Product"
      });
      expect(context.nodeModel.findOne).toHaveBeenCalledWith({
        query: {
          filter: {
            site: {
              elemMatch: {
                countryCode: { eq: process.env.SPACE_MARKET_CODE }
              }
            }
          }
        },
        type: "ContentfulResources"
      });
      expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
        ids: ["id1", "id2", "id3"],
        type: "ContentfulMicroCopy"
      });
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { allowFilterBy: [], filters: [] };
      getPlpFilters.mockReturnValue([]);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [{ categories: null }] });
      context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
        microCopy___NODE: ["id1", "id2", "id3"]
      });
      context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" }
      ]);

      expect(
        await Query.plpFilters.resolve(null, { ...args }, context)
      ).toEqual(filters);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            categories: {
              elemMatch: {
                code: {
                  in: ["category-1"]
                }
              }
            }
          }
        },
        type: "Product"
      });
      expect(context.nodeModel.findOne).toHaveBeenCalledWith({
        query: {
          filter: {
            site: {
              elemMatch: {
                countryCode: { eq: process.env.SPACE_MARKET_CODE }
              }
            }
          }
        },
        type: "ContentfulResources"
      });
      expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
        ids: ["id1", "id2", "id3"],
        type: "ContentfulMicroCopy"
      });
    });

    it("should resolve plp filters", async () => {
      const filters = { allowFilterBy: [], filters: [] };
      getPlpFilters = jest.fn().mockReturnValue([]);
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: [
          {
            code: "product-1"
          }
        ]
      });
      context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
        microCopy___NODE: ["id1", "id2", "id3"]
      });
      context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" }
      ]);

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
        filters
      );
      expect(context.nodeModel.findOne).toHaveBeenCalledWith({
        query: {
          filter: {
            site: {
              elemMatch: {
                countryCode: { eq: process.env.SPACE_MARKET_CODE }
              }
            }
          }
        },
        type: "ContentfulResources"
      });
      expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
        ids: ["id1", "id2", "id3"],
        type: "ContentfulMicroCopy"
      });

      expect(getPlpFilters).toHaveBeenCalledWith({
        allowedFilters: [],
        products: [{ code: "product-1" }],
        microCopies: new Map([
          ["key1", "value1"],
          ["key2", "value2"],
          ["key3", "value3"]
        ])
      });
    });

    describe("when GATSBY_USE_LEGACY_FILTERS = false", () => {
      it("should resolve plp filters with product categories", async () => {
        process.env.GATSBY_USE_LEGACY_FILTERS = "false";
        const filters = {
          allowFilterBy: ["Category | PRODUCT_NO"],
          filters: []
        };
        getPlpFilters = jest.fn().mockReturnValue([]);
        context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
          entries: [
            {
              code: "product-1",
              categories: [],
              groups: [
                { label: "cat 1", code: "PRODUCT_NO" },
                { label: "cat 2", code: "PRODUCT_NO" }
              ]
            }
          ]
        });
        context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
          microCopy___NODE: ["id1", "id2", "id3"]
        });
        context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          { key: "key3", value: "value3" }
        ]);

        expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
          filters
        );

        expect(context.nodeModel.findOne).toHaveBeenCalledWith({
          query: {
            filter: {
              site: {
                elemMatch: {
                  countryCode: { eq: process.env.SPACE_MARKET_CODE }
                }
              }
            }
          },
          type: "ContentfulResources"
        });
        expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
          ids: ["id1", "id2", "id3"],
          type: "ContentfulMicroCopy"
        });

        expect(getPlpFilters).toHaveBeenCalledWith({
          allowedFilters: ["Category | PRODUCT_NO"],
          products: [
            {
              categories: [],
              code: "product-1",
              groups: [
                {
                  code: "PRODUCT_NO",
                  label: "cat 1"
                },
                {
                  code: "PRODUCT_NO",
                  label: "cat 2"
                }
              ]
            }
          ],
          microCopies: new Map([
            ["key1", "value1"],
            ["key2", "value2"],
            ["key3", "value3"]
          ])
        });
      });
    });
    describe("when GATSBY_USE_LEGACY_FILTERS = true", () => {
      it("should resolve plp filters with legacy filters", async () => {
        process.env.GATSBY_USE_LEGACY_FILTERS = "true";
        const filters = {
          allowFilterBy: [
            "Brand",
            "appearanceAttributes.colourFamily",
            "generalInformation.materials",
            "appearanceAttributes.textureFamily"
          ],
          filters: []
        };
        getPlpFilters = jest.fn().mockReturnValue([]);
        context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
          entries: [
            {
              code: "product-1",
              categories: [],
              groups: [
                { label: "cat 1", code: "PRODUCT_NO" },
                { label: "cat 2", code: "PRODUCT_NO" }
              ]
            }
          ]
        });
        context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
          microCopy___NODE: ["id1", "id2", "id3"]
        });
        context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          { key: "key3", value: "value3" }
        ]);

        expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
          filters
        );

        expect(context.nodeModel.findOne).toHaveBeenCalledWith({
          query: {
            filter: {
              site: {
                elemMatch: {
                  countryCode: { eq: process.env.SPACE_MARKET_CODE }
                }
              }
            }
          },
          type: "ContentfulResources"
        });
        expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
          ids: ["id1", "id2", "id3"],
          type: "ContentfulMicroCopy"
        });

        expect(getPlpFilters).toHaveBeenCalledWith({
          allowedFilters: [
            "Brand",
            "appearanceAttributes.colourFamily",
            "generalInformation.materials",
            "appearanceAttributes.textureFamily"
          ],
          products: [
            {
              categories: [],
              code: "product-1",
              groups: [
                {
                  code: "PRODUCT_NO",
                  label: "cat 1"
                },
                {
                  code: "PRODUCT_NO",
                  label: "cat 2"
                }
              ]
            }
          ],
          microCopies: new Map([
            ["key1", "value1"],
            ["key2", "value2"],
            ["key3", "value3"]
          ])
        });
      });

      it("should resolve plp filters with legacy filters if pageCategory is not undefined", async () => {
        process.env.GATSBY_USE_LEGACY_FILTERS = "true";
        const filters = {
          allowFilterBy: [
            "Brand",
            "ProductFamily",
            "ProductLine",
            "appearanceAttributes.colourFamily",
            "generalInformation.materials",
            "appearanceAttributes.textureFamily",
            "PRODUCT_NO"
          ],
          filters: []
        };
        getPlpFilters = jest.fn().mockReturnValue([]);
        context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
          entries: [
            {
              code: "product-1",
              categories: [{ code: "category-1" }],
              groups: [
                { label: "cat 1", code: "PRODUCT_NO" },
                { label: "cat 2", code: "PRODUCT_NO" }
              ]
            }
          ]
        });
        context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
          microCopy___NODE: ["id1", "id2", "id3"]
        });
        context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          { key: "key3", value: "value3" }
        ]);

        expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
          filters
        );

        expect(context.nodeModel.findOne).toHaveBeenCalledWith({
          query: {
            filter: {
              site: {
                elemMatch: {
                  countryCode: { eq: process.env.SPACE_MARKET_CODE }
                }
              }
            }
          },
          type: "ContentfulResources"
        });
        expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
          ids: ["id1", "id2", "id3"],
          type: "ContentfulMicroCopy"
        });

        expect(getPlpFilters).toHaveBeenCalledWith({
          allowedFilters: [
            "Brand",
            "ProductFamily",
            "ProductLine",
            "appearanceAttributes.colourFamily",
            "generalInformation.materials",
            "appearanceAttributes.textureFamily",
            "PRODUCT_NO"
          ],
          products: [
            {
              categories: [{ code: "category-1" }],
              code: "product-1",
              groups: [
                {
                  code: "PRODUCT_NO",
                  label: "cat 1"
                },
                {
                  code: "PRODUCT_NO",
                  label: "cat 2"
                }
              ]
            }
          ],
          microCopies: new Map([
            ["key1", "value1"],
            ["key2", "value2"],
            ["key3", "value3"]
          ])
        });
      });
    });
  });

  describe("searchFilters", () => {
    it("should resolve search Filters", async () => {
      const filters = {
        allowFilterBy: [
          "ProductFamily",
          "ProductLine",
          "Brand",
          "appearanceAttributes.colourFamily",
          "generalInformation.materials",
          "appearanceAttributes.textureFamily",
          "Category"
        ],
        filters: []
      };
      getPlpFilters = jest.fn().mockReturnValue([]);
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: [
          {
            code: "product-1",
            categories: [],
            groups: [
              { label: "cat 1", code: "PRODUCT_NO" },
              { label: "cat 2", code: "PRODUCT_NO" }
            ]
          }
        ]
      });
      context.nodeModel.findOne = jest.fn().mockResolvedValueOnce({
        microCopy___NODE: ["id1", "id2", "id3"]
      });
      context.nodeModel.getNodesByIds = jest.fn().mockResolvedValueOnce([
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" }
      ]);

      expect(await Query.searchFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(context.nodeModel.findOne).toHaveBeenCalledWith({
        query: {
          filter: {
            site: {
              elemMatch: {
                countryCode: { eq: process.env.SPACE_MARKET_CODE }
              }
            }
          }
        },
        type: "ContentfulResources"
      });
      expect(context.nodeModel.getNodesByIds).toHaveBeenCalledWith({
        ids: ["id1", "id2", "id3"],
        type: "ContentfulMicroCopy"
      });

      expect(getPlpFilters).toHaveBeenCalledWith({
        allowedFilters: [
          "ProductFamily",
          "ProductLine",
          "Brand",
          "appearanceAttributes.colourFamily",
          "generalInformation.materials",
          "appearanceAttributes.textureFamily",
          "Category"
        ],
        products: [
          {
            categories: [],
            code: "product-1",
            groups: [
              {
                code: "PRODUCT_NO",
                label: "cat 1"
              },
              {
                code: "PRODUCT_NO",
                label: "cat 2"
              }
            ]
          }
        ],
        microCopies: new Map([
          ["key1", "value1"],
          ["key2", "value2"],
          ["key3", "value3"]
        ])
      });
    });

    it("should run query with default filters if didn't find any products", async () => {
      const filters = {
        allowFilterBy: [
          "ProductFamily",
          "ProductLine",
          "Brand",
          "appearanceAttributes.colourFamily",
          "generalInformation.materials",
          "appearanceAttributes.textureFamily",
          "Category"
        ],
        filters: []
      };
      getPlpFilters.mockReturnValue([]);
      context.nodeModel.findAll = jest.fn().mockResolvedValueOnce({
        entries: []
      });

      expect(
        await Query.searchFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {},
        type: "Product"
      });
    });
  });
  describe("fourOFour", () => {
    jest.spyOn(console, "warn");
    beforeEach(() => {
      process.env = {};
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    describe("environment variable tests", () => {
      describe("when environment variables are NOT set", () => {
        it("should log warning", async () => {
          const args: ResolveArgs = {
            categoryCodes: [],
            allowFilterBy: []
          };
          // jest.spyOn(console, "warn");
          expect(await Query.fourOFour.resolve(null, args, context)).toEqual({
            errorPageData: undefined,
            siteData: undefined
          });
          // eslint-disable-next-line no-console
          expect(console.warn).toBeCalledWith(
            "Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!"
          );
        });
      });
      describe("when SPACE_MARKET_CODE is NOT set", () => {
        it("should log warning", async () => {
          process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
          const args: ResolveArgs = {
            categoryCodes: [],
            allowFilterBy: []
          };
          // jest.spyOn(console, "warn");
          expect(await Query.fourOFour.resolve(null, args, context)).toEqual({
            errorPageData: undefined,
            siteData: undefined
          });
          // eslint-disable-next-line no-console
          expect(console.warn).toBeCalledWith(
            "Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!"
          );
        });
      });
      describe("when GATSBY_MARKET_LOCALE_CODE is NOT set", () => {
        it("should log warning", async () => {
          process.env.SPACE_MARKET_CODE = "fi";

          const args: ResolveArgs = {
            categoryCodes: [],
            allowFilterBy: []
          };
          // jest.spyOn(console, "warn");
          expect(await Query.fourOFour.resolve(null, args, context)).toEqual({
            errorPageData: undefined,
            siteData: undefined
          });
          // eslint-disable-next-line no-console
          expect(console.warn).toBeCalledWith(
            "Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!"
          );
        });
      });
      describe("when both environment variables are set", () => {
        it("should NOT log warning for environment variables", async () => {
          process.env.SPACE_MARKET_CODE = "fi";
          process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
          const args: ResolveArgs = {
            categoryCodes: [],
            allowFilterBy: []
          };
          expect(await Query.fourOFour.resolve(null, args, context)).toEqual({
            errorPageData: undefined,
            siteData: undefined
          });
          // eslint-disable-next-line no-console
          expect(console.warn).not.toBeCalledWith(
            "Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!"
          );
        });

        describe("when contentful site is NOT found", () => {
          it("should log warning for contentful site", async () => {
            process.env.SPACE_MARKET_CODE = "fi";
            process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
            const args: ResolveArgs = {
              categoryCodes: [],
              allowFilterBy: []
            };
            context.nodeModel.findOne = jest.fn().mockResolvedValueOnce(null);
            expect(await Query.fourOFour.resolve(null, args, context)).toEqual({
              errorPageData: undefined,
              siteData: undefined
            });
            // eslint-disable-next-line no-console
            expect(console.warn).toBeCalledWith(
              `Site not found in contentful: for country code: '${process.env.SPACE_MARKET_CODE}' and locale: '${process.env.GATSBY_MARKET_LOCALE_CODE}'.`
            );
          });
        });
        describe("when contentful site is found", () => {
          describe("And resource is queried", () => {
            describe("And resource is not found", () => {
              it("should log error message for Resource", async () => {
                process.env.SPACE_MARKET_CODE = "fi";
                process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
                const args: ResolveArgs = {
                  categoryCodes: [],
                  allowFilterBy: []
                };
                const mockSiteData = { contentful_id: "1" };
                context.nodeModel.findOne = jest
                  .fn()
                  .mockResolvedValueOnce(mockSiteData);
                context.nodeModel.getNodeById = jest
                  .fn()
                  .mockResolvedValueOnce(null);
                expect(
                  await Query.fourOFour.resolve(null, args, context)
                ).toEqual({
                  errorPageData: undefined,
                  siteData: mockSiteData
                });
                // eslint-disable-next-line no-console
                expect(console.warn).toBeCalledWith(
                  `Resource not found: for site in contentful with id: '${mockSiteData.contentful_id}'.`
                );
              });
            });
            describe("And resource is found", () => {
              describe("And errorFourOFour object is NOT found", () => {
                it("should log error message for errorFourOFour", async () => {
                  process.env.SPACE_MARKET_CODE = "fi";
                  process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
                  const args: ResolveArgs = {
                    categoryCodes: [],
                    allowFilterBy: []
                  };
                  const mockSiteData = { contentful_id: "1" };
                  const mockSiteResource = {
                    errorFourOFour___NODE: "for_o_four_id",
                    contentful_id: "2"
                  };
                  context.nodeModel.findOne = jest
                    .fn()
                    .mockResolvedValueOnce(mockSiteData);
                  context.nodeModel.getNodeById = jest
                    .fn()
                    .mockResolvedValueOnce(mockSiteResource)
                    .mockResolvedValueOnce(null);
                  expect(
                    await Query.fourOFour.resolve(null, args, context)
                  ).toEqual({
                    errorPageData: undefined,
                    siteData: mockSiteData
                  });
                  // eslint-disable-next-line no-console
                  expect(console.warn).toBeCalledWith(
                    `'errorFourOFour' not found on resource in contentful with id: '${mockSiteResource.contentful_id}'.`
                  );
                });
              });
              describe("And errorFourOFour object is found", () => {
                it("should return FourOFourResponse with site data and error data", async () => {
                  process.env.SPACE_MARKET_CODE = "fi";
                  process.env.GATSBY_MARKET_LOCALE_CODE = "fi-FI";
                  const args: ResolveArgs = {
                    categoryCodes: [],
                    allowFilterBy: []
                  };
                  const mockSiteData = { contentful_id: "1" };
                  const mockSiteResource = {
                    errorFourOFour___NODE: "for_o_four_id",
                    contentful_id: "2"
                  };
                  const mockErrorFourOFourResource = {
                    id: "9999",
                    contentful_id: "3",
                    spaceId: "space_id",
                    title: "title_1",
                    subtitle: "sub_title_1"
                  };
                  context.nodeModel.findOne = jest
                    .fn()
                    .mockResolvedValueOnce(mockSiteData);
                  context.nodeModel.getNodeById = jest
                    .fn()
                    .mockResolvedValueOnce(mockSiteResource)
                    .mockResolvedValueOnce(mockErrorFourOFourResource);

                  expect(
                    await Query.fourOFour.resolve(null, args, context)
                  ).toEqual({
                    errorPageData: mockErrorFourOFourResource,
                    siteData: mockSiteData
                  });
                  // eslint-disable-next-line no-console
                  expect(console.warn).toBeCalledTimes(0);
                });
              });
            });
          });
        });
      });
    });
  });
});
