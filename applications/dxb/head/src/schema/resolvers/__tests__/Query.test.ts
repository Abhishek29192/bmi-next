import { Context, ResolveArgs } from "../types";

const context: Context = {
  nodeModel: {
    findAll: jest.fn().mockResolvedValue({ entries: [] }),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn()
  }
};

jest.mock("../../../utils/encryption", () => {
  const originalModule = jest.requireActual("../../../utils/encryption");

  return {
    ...originalModule,
    generateIdFromString: (name: string) => name
  };
});

const getPlpFilters = jest.fn();
const getFilters = jest.fn();
jest.mock("../../../utils/filters", () => ({
  getPlpFilters,
  getFilters
}));

const resolveDocumentsFromProducts = jest.fn();
jest.mock("../documents", () => ({
  resolveDocumentsFromProducts
}));

import Query from "../Query";

describe("Query resolver", () => {
  describe("allPIMDocument", () => {
    it("should contain specific type", () => {
      expect(Query.allPIMDocument.type).toEqual(["PIMDocument"]);
    });
    it("should resolve pim documents without filters", async () => {
      /*       context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ nodes: [] }); */
      const result = { documents: [] };
      resolveDocumentsFromProducts.mockResolvedValue(result);

      expect(await Query.allPIMDocument.resolve(null, null, context)).toEqual(
        result
      );

      expect(resolveDocumentsFromProducts).toHaveBeenCalledWith([], {
        source: {},
        context
      });
    });
  });

  describe("plpFilters", () => {
    const args: ResolveArgs = {
      pimClassificationCatalogueNamespace:
        "pimClassificationCatalogueNamespace",
      categoryCodes: ["category-1"],
      allowFilterBy: []
    };
    it("should contain specific type", () => {
      expect(Query.plpFilters.type).toEqual(["Filter"]);
    });
    it("should contain specific query args", () => {
      expect(Query.plpFilters.args).toEqual({
        pimClassificationCatalogueNamespace: "String!",
        categoryCodes: "[String!]",
        showBrandFilter: "Boolean",
        allowFilterBy: "[String!]"
      });
    });

    it("should handle empty products list", async () => {
      context.nodeModel.findAll = jest.fn().mockResolvedValue({ entries: [] });

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual([]);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            approvalStatus: { eq: "approved" },
            categories: { elemMatch: { code: { in: ["category-1"] } } },
            variantOptions: {
              elemMatch: { approvalStatus: { eq: "approved" } }
            }
          }
        },
        type: "Products"
      });
    });

    it("should run query without filters if not provided", async () => {
      const filters = { filters: [] };
      getPlpFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest.fn().mockResolvedValue({
        entries: [
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]
      });

      expect(
        await Query.plpFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(getPlpFilters).toBeCalledWith({
        allowedFilters: [],
        pageCategory: undefined,
        pimClassificationNamespace: "pimClassificationCatalogueNamespace",
        products: [
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]
      });

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {},
        type: "Products"
      });
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { filters: [] };
      getPlpFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValue({ entries: [{ categories: null }] });

      expect(
        await Query.plpFilters.resolve(null, { ...args }, context)
      ).toEqual(filters);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            approvalStatus: {
              eq: "approved"
            },
            categories: {
              elemMatch: {
                code: {
                  in: ["category-1"]
                }
              }
            },
            variantOptions: {
              elemMatch: {
                approvalStatus: {
                  eq: "approved"
                }
              }
            }
          }
        },
        type: "Products"
      });
    });

    it("should resolve plp filters", async () => {
      const filters = { filters: [] };
      getPlpFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest.fn().mockResolvedValue({
        entries: [{ products: [{ code: "product-1" }] }]
      });

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(getPlpFilters).toHaveBeenCalledWith({
        allowedFilters: [],
        pimClassificationNamespace: "pimClassificationCatalogueNamespace",
        products: [{ products: [{ code: "product-1" }] }]
      });
    });
  });

  describe("productFilters", () => {
    const args: ResolveArgs = {
      pimClassificationCatalogueNamespace:
        "pimClassificationCatalogueNamespace",
      categoryCodes: ["category-1"],
      allowFilterBy: [],
      showBrandFilter: true
    };
    it("should contain specific type", () => {
      expect(Query.productFilters.type).toEqual(["Filter"]);
    });
    it("should contain specific query args", () => {
      expect(Query.productFilters.args).toEqual({
        pimClassificationCatalogueNamespace: "String!",
        categoryCodes: "[String!]",
        showBrandFilter: "Boolean"
      });
    });

    it("should handle empty products list", async () => {
      context.nodeModel.findAll = jest.fn().mockResolvedValue({ entries: [] });

      expect(await Query.productFilters.resolve(null, args, context)).toEqual(
        []
      );

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            categories: { elemMatch: { code: { in: ["category-1"] } } }
          }
        },
        type: "Products"
      });
    });

    it("should run query without filters if not provided", async () => {
      const filters = { filters: [] };
      getFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest.fn().mockResolvedValue({
        entries: [
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]
      });

      expect(
        await Query.productFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {},
        type: "Products"
      });
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { filters: [] };
      getFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValue({ entries: [{ categories: null }] });

      expect(
        await Query.productFilters.resolve(null, { ...args }, context)
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
        type: "Products"
      });
    });

    it("should resolve product filters", async () => {
      const filters = { filters: [] };
      getFilters.mockResolvedValue(filters);
      context.nodeModel.findAll = jest.fn().mockResolvedValue({
        entries: [
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]
      });

      expect(await Query.productFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(getFilters).toHaveBeenCalledWith(
        "pimClassificationCatalogueNamespace",
        [{ categories: [{ code: "category-1" }, { code: "category-2" }] }],
        { code: "category-1" },
        true
      );
    });
  });
});
