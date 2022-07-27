import ContentfulDocumentLibraryPage from "../ContentfulDocumentLibraryPage";
import { ContentfulDocumentLibraryPage as ContentfulDocumentLibraryPageType } from "../types/Contentful";
import { Context } from "../types/Gatsby";

const mockFindAll = jest.fn();
const mockGetNodeById = jest.fn();
const context: Context = {
  nodeModel: {
    findAll: mockFindAll,
    findOne: jest.fn(),
    getNodeById: mockGetNodeById,
    getNodesByIds: jest.fn()
  }
};

const mockResolveDocumentsFromProducts = jest.fn();
const mockResolveDocumentsFromContentful = jest.fn();
jest.mock("../utils/documents", () => ({
  resolveDocumentsFromProducts: (...args: any) =>
    mockResolveDocumentsFromProducts(...args),
  resolveDocumentsFromContentful: (...args: any) =>
    mockResolveDocumentsFromContentful(...args)
}));

const mockSortPimDocuments = jest.fn();
const mockSortCmsDocuments = jest.fn();
const mockSortAllDocuments = jest.fn();
jest.mock("../utils/documentLibrarySort", () => ({
  sortPimDocuments: (...args: any) => mockSortPimDocuments(...args),
  sortCmsDocuments: (...args: any) => mockSortCmsDocuments(...args),
  sortAllDocuments: (...args: any) => mockSortAllDocuments(...args)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("ContentfulDocumentLibraryPage resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulDocumentLibraryPage.documentsWithFilters.type).toEqual(
      "DocumentsWithFiltersResponse"
    );
  });

  it("should resolve assets for Simple PIM source with asset types on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes.texturefamily"
      ]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes.texturefamily",
        "appearanceAttributes.colour"
      ]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical PIM source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily"]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes.colour"]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection PIM source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "PIM",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "product-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortPimDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with asset types on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const document = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [document],
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "CMS",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ],
      documents: [{ id: "cms-document-1" }]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortCmsDocuments).toHaveBeenCalledWith([document]);
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple ALL source with asset types on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes.texturefamily"
      ]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes.texturefamily",
        "appearanceAttributes.colour"
      ]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option3", value: "value3" }]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" },
            { label: "option1", value: "value1" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes.texturefamily",
        "appearanceAttributes.colour"
      ]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source without allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes.colour"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option3", value: "value3" }]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" },
            { label: "option1", value: "value1" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes.colour"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source without allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: null
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    const contentfulDocument = { id: "cms-document-1" };
    mockResolveDocumentsFromContentful.mockResolvedValueOnce({
      documents: [contentfulDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option1", value: "value1" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    const productDocument = { id: "product-document-1" };
    mockResolveDocumentsFromProducts.mockResolvedValueOnce({
      documents: [productDocument],
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option2", value: "value2" }]
        },
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [{ label: "option3", value: "value3" }]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });
    mockSortAllDocuments.mockReturnValueOnce([
      contentfulDocument,
      productDocument
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: null,
      parent: null,
      internal: null,
      assetTypes___NODE: null,
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsWithFilters =
      await ContentfulDocumentLibraryPage.documentsWithFilters.resolve(
        source,
        null,
        context
      );

    expect(documentsWithFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" },
            { label: "option1", value: "value1" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ],
      documents: [contentfulDocument, productDocument]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: {}, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockSortAllDocuments).toHaveBeenCalledWith(
      [contentfulDocument, productDocument],
      [assetType]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });
});
