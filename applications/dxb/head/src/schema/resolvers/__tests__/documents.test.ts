import { Context, Node } from "../types";
import {
  resolveDocumentsFromContentful,
  resolveDocumentsFromProducts
} from "../documents";
import createAsset from "../../../__tests__/AssetHelper";

const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll: jest.fn()
  }
};

jest.mock("../../../utils/encryption", () => {
  const originalModule = jest.requireActual("../../../utils/encryption");

  return {
    ...originalModule,
    generateIdFromString: (name: string) => name
  };
});

describe("documents resolver utils", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("resolveDocumentsFromProducts", () => {
    const assetTypes = [
      {
        pimCode: "ASSEMBLY_INSTRUCTIONS",
        id: "asset-type-1",
        name: "asset-type-name-1"
      },
      { pimCode: "AWARDS", id: "asset-type-2", name: "asset-type-name-2" }
    ];
    const source: Partial<Node> = {
      id: "source-id",
      pimCodes: ["ASSEMBLY_INSTRUCTIONS", "AWARDS"],
      categoryCodes: ["category-code-1", "category-code-2"]
    };
    process.env.SPACE_MARKET_CODE = "SPACE_MARKET_CODE";
    it("should return empty array if no products found", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });
      expect(
        await resolveDocumentsFromProducts(assetTypes, { source, context })
      ).toEqual([]);
      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            assets: {
              elemMatch: {
                assetType: {
                  in: ["ASSEMBLY_INSTRUCTIONS", "AWARDS"]
                }
              }
            },
            categories: {
              elemMatch: {
                code: {
                  in: ["category-code-1", "category-code-2"]
                }
              }
            },
            code: {
              in: ["ASSEMBLY_INSTRUCTIONS", "AWARDS"]
            }
          }
        },
        type: "Products"
      });
    });
    it("should run query with empty filter if no assetTypes provided", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });
      expect(
        await resolveDocumentsFromProducts([], { source, context })
      ).toEqual([]);
      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {}
        },
        type: "Products"
      });
    });
    it("should run query without pimCodes or categoryCodes if no provided", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: [] });
      const sourceWitoutCodes: Partial<Node> = {
        ...source,
        pimCodes: undefined,
        categoryCodes: undefined
      };
      expect(
        await resolveDocumentsFromProducts(assetTypes, {
          source: sourceWitoutCodes,
          context
        })
      ).toEqual([]);
      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            assets: {
              elemMatch: {
                assetType: {
                  in: ["ASSEMBLY_INSTRUCTIONS", "AWARDS"]
                }
              }
            }
          }
        },
        type: "Products"
      });
    });

    it("should return valid documents", async () => {
      const products: Partial<Node>[] = [
        {
          id: "product-1",
          name: "product-1-name",
          assets: [
            createAsset({
              name: "asset-1"
            }),
            createAsset({
              name: "asset-2",
              assetType: "AWARDS"
            }),
            createAsset({
              name: "asset-3",
              allowedToDownload: true,
              fileSize: 1024
            }),
            createAsset({
              name: "asset-4",
              allowedToDownload: true,
              fileSize: 1024,
              mime: null
            }),
            createAsset({
              name: "asset-5",
              url: ""
            }),
            createAsset({
              name: "asset-6",
              allowedToDownload: true,
              fileSize: 1024,
              realFileName: ""
            }),
            createAsset({
              name: ""
            })
          ]
        },
        {
          id: "products-2",
          name: "product-2-name",
          assets: undefined
        }
      ];

      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValue({ entries: products });
      expect(
        await resolveDocumentsFromProducts(assetTypes, { source, context })
      ).toEqual([
        {
          assetType___NODE: "asset-type-1",
          children: [],
          id: "product-1-nameasset-1",
          internal: {
            contentDigest: "bab90058677bb11e0a14c2fdc4788b99",
            owner: "@bmi/resolvers",
            type: "PIMLinkDocument"
          },
          isLinkDocument: true,
          parent: "source-id",
          product___NODE: "product-1",
          title: "asset-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-2",
          children: [],
          id: "product-1-nameasset-2",
          internal: {
            contentDigest: "827e3e7a40105c38bde2d1370ec1e174",
            owner: "@bmi/resolvers",
            type: "PIMLinkDocument"
          },
          isLinkDocument: true,
          parent: "source-id",
          product___NODE: "product-1",
          title: "asset-2",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-1",
          children: [],
          extension: "pdf",
          fileSize: 1024,
          format: "application/pdf",
          id: "product-1-nameasset-3",
          internal: {
            contentDigest: "8ce431c74abbe3fc435249dbbc2b2a1b",
            owner: "@bmi/resolvers",
            type: "PIMDocument"
          },
          isLinkDocument: false,
          parent: "source-id",
          product___NODE: "product-1",
          realFileName: "asset-real-file-name.pdf",
          title: "asset-3",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-1",
          children: [],
          extension: "pdf",
          fileSize: 1024,
          format: "application/pdf",
          id: "product-1-nameasset-4",
          internal: {
            contentDigest: "8d2daadbab0f59acf7ce7766becc150d",
            owner: "@bmi/resolvers",
            type: "PIMDocument"
          },
          isLinkDocument: false,
          parent: "source-id",
          product___NODE: "product-1",
          realFileName: "asset-real-file-name.pdf",
          title: "asset-4",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        },
        {
          assetType___NODE: "asset-type-1",
          children: [],
          id: "product-1-name",
          internal: {
            contentDigest: "ba1d773a5aa6b19d4f4132324f7776bc",
            owner: "@bmi/resolvers",
            type: "PIMLinkDocument"
          },
          isLinkDocument: true,
          parent: "source-id",
          product___NODE: "product-1",
          title: "product-1-name asset-type-name-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        }
      ]);
    });

    it("should return valid documents if resources provided", async () => {
      const products: Partial<Node>[] = [
        {
          id: "product-1",
          name: "product-1-name",
          assets: [
            createAsset({
              name: "asset-1"
            })
          ]
        }
      ];
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: products })
        .mockResolvedValueOnce({
          entries: [
            {
              productDocumentNameMap: "Product name + asset type"
            }
          ]
        });
      expect(
        await resolveDocumentsFromProducts(assetTypes, { source, context })
      ).toEqual([
        {
          assetType___NODE: "asset-type-1",
          children: [],
          id: "product-1-nameasset-1",
          internal: {
            contentDigest: "ba1d773a5aa6b19d4f4132324f7776bc",
            owner: "@bmi/resolvers",
            type: "PIMLinkDocument"
          },
          isLinkDocument: true,
          parent: "source-id",
          product___NODE: "product-1",
          title: "product-1-name asset-type-name-1",
          url: "http://localhost:8000/asset-real-file-name.pdf"
        }
      ]);
    });
  });
  describe("resolveDocumentFromContentful", () => {
    const assetTypes = [
      { id: "asset-type-1" },
      { id: "asset-type-2" },
      { id: "asset-type-3" }
    ];
    const documents = [{ id: "document-1" }, { id: "document-2" }];
    it("should return documents", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: documents });
      expect(
        await resolveDocumentsFromContentful(assetTypes, { context })
      ).toEqual(documents);
      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {
            assetType: {
              id: {
                in: ["asset-type-1", "asset-type-2", "asset-type-3"]
              }
            }
          }
        },
        type: "ContentfulDocument"
      });
    });
    it("should run query with empty filter if no assetTypes provided", async () => {
      context.nodeModel.findAll = jest
        .fn()
        .mockResolvedValueOnce({ entries: documents });
      expect(await resolveDocumentsFromContentful([], { context })).toEqual(
        documents
      );
      expect(context.nodeModel.findAll).toHaveBeenCalledWith({
        query: {
          filter: {}
        },
        type: "ContentfulDocument"
      });
    });
  });
});
