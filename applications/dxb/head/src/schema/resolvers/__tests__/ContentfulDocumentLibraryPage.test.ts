import ContentfulDocumentLibraryPage from "../ContentfulDocumentLibraryPage";
import { Context, Node } from "../types/Gatsby";
import * as Documents from "../utils/documents";

const context: Context = {
  nodeModel: {
    findAll: jest.fn().mockResolvedValue({
      entries: [{ id: "asset-type-1" }, { id: "asset-type-2" }]
    }),
    findOne: jest.fn(),
    getNodeById: jest.fn().mockResolvedValueOnce({ id: "asset-type-1" }),
    getNodesByIds: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null
};

const source2 = {
  assetTypes___NODE: ["asset-type-1"],
  children: null,
  id: "source",
  internal: null,
  parent: null,
  source: "ALL"
};

jest.mock("../utils/documents", () => ({
  resolveDocumentsFromProducts: jest.fn().mockResolvedValue({
    documents: [{ id: "product-document-1" }],
    filters: []
  }),
  resolveDocumentsFromContentful: jest.fn().mockResolvedValue({
    documents: [{ id: "contentful-document-1" }],
    filters: []
  })
}));

describe("ContentfulDocumentLibraryPage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulDocumentLibraryPage.documentsWithFilters.type).toEqual(
      "DocumentsWithFiltersResponse"
    );
  });
  it("should resolve assets for PIM source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromProducts");

    const sourcePIM = { ...source, source: "PIM" };

    expect(
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        sourcePIM,
        null,
        context
      )
    ).toEqual({
      documents: [{ id: "product-document-1" }],
      filters: []
    });

    expect(context.nodeModel.findAll).toBeCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(Documents.resolveDocumentsFromProducts).toBeCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        source: sourcePIM,
        context
      },
      []
    );
  });
  it("should resolve assets for CMS source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromContentful");

    expect(
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        { ...source, source: "CMS" },
        null,
        context
      )
    ).toEqual({
      documents: [{ id: "contentful-document-1" }],
      filters: []
    });

    expect(Documents.resolveDocumentsFromContentful).toBeCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      { source: { ...source, source: "CMS" }, context },
      []
    );
    expect(context.nodeModel.findAll).toBeCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
  });
  it("should resolve assets for ALL source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromProducts");
    jest.spyOn(Documents, "resolveDocumentsFromContentful");

    const sourceAll = { ...source, source: "ALL" };

    expect(
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        sourceAll,
        null,
        context
      )
    ).toEqual({
      documents: [
        { id: "contentful-document-1" },
        { id: "product-document-1" }
      ],
      filters: []
    });
    expect(Documents.resolveDocumentsFromProducts).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        source: sourceAll,
        context
      },
      []
    );
    expect(Documents.resolveDocumentsFromContentful).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        source: {
          children: null,
          id: "source",
          internal: null,
          parent: null,
          source: "ALL"
        },
        context
      },
      ["Brand", "AssetType"]
    );
  });

  it("should use specific asset types if provided", async () => {
    const sourceAll = {
      ...source,
      source: "ALL",
      assetTypes___NODE: ["asset-type-1"]
    };
    expect(
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        sourceAll,
        null,
        context
      )
    ).toEqual({
      documents: [
        { id: "contentful-document-1" },
        { id: "product-document-1" }
      ],
      filters: []
    });
    expect(context.nodeModel.getNodeById).toBeCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(Documents.resolveDocumentsFromProducts).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }],
      {
        source: sourceAll,
        context
      },
      []
    );
    expect(Documents.resolveDocumentsFromContentful).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }],
      { source: source2, context },
      ["Brand", "AssetType"]
    );
  });

  it("should return empty array for invalid source", async () => {
    expect(
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        { ...source, source: "INVALID" },
        null,
        context
      )
    ).toEqual({ documents: [], filters: [] });
  });
});
