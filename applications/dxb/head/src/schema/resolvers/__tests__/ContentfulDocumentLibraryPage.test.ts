import ContentfulDocumentLibraryPage from "../ContentfulDocumentLibraryPage";
import * as Documents from "../documents";
import { Context, Node } from "../types";

const context: Context = {
  nodeModel: {
    getAllNodes: jest
      .fn()
      .mockResolvedValue([{ id: "asset-type-1" }, { id: "asset-type-2" }]),
    getNodeById: jest.fn().mockResolvedValueOnce({ id: "asset-type-1" }),
    getNodesByIds: jest.fn(),
    findAll: jest.fn()
  }
};

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null
};

jest.mock("../documents", () => ({
  resolveDocumentsFromProducts: jest
    .fn()
    .mockResolvedValue([{ id: "product-document-1" }]),
  resolveDocumentsFromContentful: jest
    .fn()
    .mockResolvedValue([{ id: "contentful-document-1" }])
}));

describe("ContentfulDocumentLibraryPage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulDocumentLibraryPage.documents.type).toEqual(["Document"]);
  });
  it("should resolve assets for PIM source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromProducts");

    const sourcePIM = { ...source, source: "PIM" };

    expect(
      await ContentfulDocumentLibraryPage.documents.resolve(
        sourcePIM,
        null,
        context
      )
    ).toEqual([{ id: "product-document-1" }]);

    expect(context.nodeModel.getAllNodes).toBeCalledWith(
      { type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(Documents.resolveDocumentsFromProducts).toBeCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        source: sourcePIM,
        context
      }
    );
  });
  it("should resolve assets for CMS source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromContentful");

    expect(
      await ContentfulDocumentLibraryPage.documents.resolve(
        { ...source, source: "CMS" },
        null,
        context
      )
    ).toEqual([{ id: "contentful-document-1" }]);

    expect(Documents.resolveDocumentsFromContentful).toBeCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      { context }
    );
    expect(context.nodeModel.getAllNodes).toBeCalledWith(
      { type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
  });
  it("should resolve assets for ALL source", async () => {
    jest.spyOn(Documents, "resolveDocumentsFromProducts");
    jest.spyOn(Documents, "resolveDocumentsFromContentful");

    const sourceAll = { ...source, source: "ALL" };

    expect(
      await ContentfulDocumentLibraryPage.documents.resolve(
        sourceAll,
        null,
        context
      )
    ).toEqual([{ id: "contentful-document-1" }, { id: "product-document-1" }]);
    expect(Documents.resolveDocumentsFromProducts).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        source: sourceAll,
        context
      }
    );
    expect(Documents.resolveDocumentsFromContentful).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }, { id: "asset-type-2" }],
      {
        context
      }
    );
  });

  it("should use specific asset types if provided", async () => {
    const sourceAll = {
      ...source,
      source: "ALL",
      assetTypes___NODE: ["asset-type-1"]
    };
    expect(
      await ContentfulDocumentLibraryPage.documents.resolve(
        sourceAll,
        null,
        context
      )
    ).toEqual([{ id: "contentful-document-1" }, { id: "product-document-1" }]);
    expect(context.nodeModel.getNodeById).toBeCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(Documents.resolveDocumentsFromProducts).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }],
      {
        source: sourceAll,
        context
      }
    );
    expect(Documents.resolveDocumentsFromContentful).toHaveBeenCalledWith(
      [{ id: "asset-type-1" }],
      { context }
    );
  });

  it("should return empty array for invalid source", async () => {
    expect(
      await ContentfulDocumentLibraryPage.documents.resolve(
        { ...source, source: "INVALID" },
        null,
        context
      )
    ).toEqual([]);
  });
});
