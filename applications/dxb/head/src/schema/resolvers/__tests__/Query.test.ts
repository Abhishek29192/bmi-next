import { Context, ResolveArgs } from "../types";
import Query from "../Query";
import * as Documents from "../documents";
import * as Filters from "../../../utils/filters";

const context: Context = {
  nodeModel: {
    getAllNodes: jest.fn().mockResolvedValue({ nodes: [] }),
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    runQuery: jest.fn()
  }
};

jest.mock("../../../utils/encryption", () => {
  const originalModule = jest.requireActual("../../../utils/encryption");

  return {
    ...originalModule,
    generateIdFromString: (name: string) => name
  };
});

jest.mock("../../../utils/filters");

jest.mock("../documents");

describe("Query resolver", () => {
  describe("allPIMDocument", () => {
    it("should contain specific type", () => {
      expect(Query.allPIMDocument.type).toEqual(["PIMDocument"]);
    });
    it("should resolve pim documents without filters", async () => {
      const result = { documents: [] };
      jest
        .spyOn(Documents, "resolveDocumentsFromProducts")
        // @ts-ignore
        .mockResolvedValue(result);

      expect(await Query.allPIMDocument.resolve(null, null, context)).toEqual(
        result
      );

      expect(Documents.resolveDocumentsFromProducts).toHaveBeenCalledWith(
        { nodes: [] },
        { source: {}, context }
      );
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
      context.nodeModel.runQuery = jest.fn().mockResolvedValue([]);

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual([]);

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
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
      // @ts-ignore
      jest.spyOn(Filters, "getPlpFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]);

      expect(
        await Query.plpFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(Filters.getPlpFilters).toBeCalledWith({
        allowedFilters: [],
        pageCategory: undefined,
        pimClassificationNamespace: "pimClassificationCatalogueNamespace",
        products: [
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]
      });

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
        query: {},
        type: "Products"
      });
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { filters: [] };
      // @ts-ignore
      jest.spyOn(Filters, "getPlpFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([{ categories: null }]);

      expect(
        await Query.plpFilters.resolve(null, { ...args }, context)
      ).toEqual(filters);

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
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
      // @ts-ignore
      jest.spyOn(Filters, "getPlpFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([{ categories: [{ code: "category-1" }] }]);

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(Filters.getPlpFilters).toHaveBeenCalledWith({
        allowedFilters: [],
        pageCategory: { code: "category-1" },
        pimClassificationNamespace: "pimClassificationCatalogueNamespace",
        products: [{ categories: [{ code: "category-1" }] }]
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
      context.nodeModel.runQuery = jest.fn().mockResolvedValue([]);

      expect(await Query.productFilters.resolve(null, args, context)).toEqual(
        []
      );

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
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
      // @ts-ignore
      jest.spyOn(Filters, "getFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]);

      expect(
        await Query.productFilters.resolve(
          null,
          { ...args, categoryCodes: null },
          context
        )
      ).toEqual(filters);

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
        query: {},
        type: "Products"
      });
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { filters: [] };
      // @ts-ignore
      jest.spyOn(Filters, "getFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([{ categories: null }]);

      expect(
        await Query.productFilters.resolve(null, { ...args }, context)
      ).toEqual(filters);

      expect(context.nodeModel.runQuery).toHaveBeenCalledWith({
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
      // @ts-ignore
      jest.spyOn(Filters, "getFilters").mockResolvedValue(filters);
      context.nodeModel.runQuery = jest
        .fn()
        .mockResolvedValue([
          { categories: [{ code: "category-1" }, { code: "category-2" }] }
        ]);

      expect(await Query.productFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(Filters.getFilters).toHaveBeenCalledWith(
        "pimClassificationCatalogueNamespace",
        [{ categories: [{ code: "category-1" }, { code: "category-2" }] }],
        { code: "category-1" },
        true
      );
    });
  });
});
