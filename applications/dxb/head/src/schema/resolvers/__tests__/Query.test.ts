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
    const args: ResolveArgs = {
      categoryCodes: ["category-1"],
      allowFilterBy: []
    };
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
    });

    it("should run query if resolved categories is empty", async () => {
      const filters = { allowFilterBy: [], filters: [] };
      getPlpFilters.mockReturnValue([]);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [{ categories: null }] })
        .mockResolvedValueOnce({ entries: [] });

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
    });

    it("should resolve plp filters", async () => {
      const filters = { allowFilterBy: [], filters: [] };
      getPlpFilters = jest.fn().mockReturnValue([]);
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({
          entries: [
            {
              code: "product-1"
            }
          ]
        })
        .mockResolvedValueOnce({ entries: [] });

      expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
        filters
      );

      expect(getPlpFilters).toHaveBeenCalledWith({
        allowedFilters: [],
        products: [{ code: "product-1" }],
        microCopies: new Map()
      });
    });

    describe("when GATSBY_USE_LEGACY_FILTERS = false", () => {
      it("should resolve plp filters with product categories", async () => {
        process.env.GATSBY_USE_LEGACY_FILTERS = "false";
        const filters = { allowFilterBy: ["PRODUCT_NO"], filters: [] };
        getPlpFilters = jest.fn().mockReturnValue([]);
        context.nodeModel.findAll = jest
          .fn()
          .mockResolvedValueOnce({
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
          })
          .mockResolvedValueOnce({ entries: [] });

        expect(await Query.plpFilters.resolve(null, args, context)).toEqual(
          filters
        );

        expect(getPlpFilters).toHaveBeenCalledWith({
          allowedFilters: ["PRODUCT_NO"],
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
          microCopies: new Map()
        });
      });
    });
  });
});
