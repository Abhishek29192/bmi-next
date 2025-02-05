import ContentfulDocumentLibraryPage from "../ContentfulDocumentLibraryPage";
import { ContentfulDocumentLibraryPage as ContentfulDocumentLibraryPageType } from "../types/Contentful";
import { Context, ResolveArgs } from "../types/Gatsby";

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

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

const mockResolveDocumentsFiltersFromProducts = jest.fn();
const mockResolveDocumentsFiltersFromContentful = jest.fn();
jest.mock("../utils/documents", () => ({
  resolveDocumentsFiltersFromProducts: (...args: any) =>
    mockResolveDocumentsFiltersFromProducts(...args),
  resolveDocumentsFiltersFromContentful: (...args: any) =>
    mockResolveDocumentsFiltersFromContentful(...args)
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
    expect(ContentfulDocumentLibraryPage.documentsFilters.type).toEqual(
      "DocumentsFiltersResponse"
    );
  });

  it("should resolve assets for Simple PIM source with asset types on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes$texturefamily"
      ]
    );
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes$texturefamily",
        "appearanceAttributes$colour"
      ]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical PIM source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes$colour"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection PIM source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);
    mockSortPimDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection PIM source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "PIM",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromContentful).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with asset types on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);
    mockSortCmsDocuments.mockReturnValueOnce([document]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source without allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source with allow filter by on the source provided", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter",
        filterCode: "filter-code-",
        options: [{ label: "option", value: "value" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "CMS",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter",
          filterCode: "filter-code-",
          options: [{ label: "option", value: "value" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockResolveDocumentsFiltersFromProducts).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortAllDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple ALL source with asset types on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockGetNodeById.mockResolvedValueOnce(assetType);
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: ["asset-type-1"],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockGetNodeById).toHaveBeenCalledWith({
      id: "asset-type-1",
      type: "ContentfulAssetType"
    });
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes$texturefamily"
      ]
    );

    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes$texturefamily",
        "appearanceAttributes$colour"
      ]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Simple CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
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
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
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
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Simple",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option1", value: "value1" },
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["AssetType", "Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      [
        "AssetType",
        "Brand",
        "ProductFamily",
        "appearanceAttributes$texturefamily",
        "appearanceAttributes$colour"
      ]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source without allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes$colour"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Technical CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
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
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
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
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Technical",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option1", value: "value1" },
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand", "ProductFamily", "appearanceAttributes$colour"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source without allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: []
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source with allow filter by on the source provided with product filters before Contentful", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
      {
        label: "filter1",
        filterCode: "filter-code-1",
        options: [{ label: "option1", value: "value1" }]
      }
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
      {
        label: "filter2",
        filterCode: "filter-code-2",
        options: [{ label: "option2", value: "value2" }]
      }
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
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
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should resolve assets for Card Collection CMS source on the source provided de-duplicates filters", async () => {
    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
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
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
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
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option1", value: "value1" },
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      { query: { filter: {} }, type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();
  });

  it("should filter asset types by MARKET_TAG_NAME if provided", async () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    process.env.MARKET_TAG_NAME = "market__norway";

    const assetType = { id: "asset-type-1" };
    mockFindAll.mockResolvedValueOnce({ entries: [assetType] });
    mockResolveDocumentsFiltersFromContentful.mockResolvedValueOnce([
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
    ]);
    mockResolveDocumentsFiltersFromProducts.mockResolvedValueOnce([
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
    ]);

    const source: ContentfulDocumentLibraryPageType = {
      id: "source",
      resultsType: "Card Collection",
      source: "ALL",
      children: [],
      parent: null,
      internal: { type: "", contentDigest: "", owner: "" },
      assetTypes___NODE: [],
      allowFilterBy: ["appearanceAttributes.colour"]
    };

    const documentsFilters =
      await ContentfulDocumentLibraryPage.documentsFilters.resolve(
        source,
        args,
        context
      );

    expect(documentsFilters).toEqual({
      filters: [
        {
          label: "filter1",
          filterCode: "filter-code-1",
          options: [
            { label: "option1", value: "value1" },
            { label: "option2", value: "value2" },
            { label: "option3", value: "value3" }
          ]
        },
        {
          label: "filter2",
          filterCode: "filter-code-2",
          options: [{ label: "option2", value: "value2" }]
        }
      ]
    });

    expect(mockFindAll).toHaveBeenCalledWith(
      {
        query: {
          filter: {
            metadata: {
              tags: {
                elemMatch: {
                  contentful_id: {
                    eq: process.env.MARKET_TAG_NAME
                  }
                }
              }
            }
          }
        },
        type: "ContentfulAssetType"
      },
      { connectionType: "ContentfulAssetType" }
    );
    expect(mockResolveDocumentsFiltersFromContentful).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );
    expect(mockResolveDocumentsFiltersFromProducts).toHaveBeenCalledWith(
      [assetType],
      {
        source,
        context
      },
      ["Brand"]
    );

    expect(mockGetNodeById).not.toHaveBeenCalled();
    expect(mockSortPimDocuments).not.toHaveBeenCalled();
    expect(mockSortCmsDocuments).not.toHaveBeenCalled();

    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });
});
