import {
  createFullyPopulatedAssetType,
  createFullyPopulatedResources,
  createResponse
} from "@bmi/contentful-types";
import { getAssetTypes, getProductDocumentNameMap } from "../contentfulApi";

const getContentfulClient = jest.fn();
const getEntries = jest.fn();
jest.mock("@bmi/functions-contentful-client", () => ({
  getContentfulClient: () => getContentfulClient()
}));

getContentfulClient.mockReturnValue({
  getEntries: (...params: any[]) => getEntries(...params)
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("getAssetTypes", () => {
  it("should throw error if getContentfulClient throws error", async () => {
    const locale = "en-US";
    getContentfulClient.mockImplementationOnce(() => {
      throw Error("Expected error");
    });

    try {
      await getAssetTypes(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toBeCalled();
    expect(getEntries).not.toBeCalled();
  });

  it("should throw error if getEntries throws error", async () => {
    const locale = "en-US";
    getEntries.mockRejectedValueOnce(Error("Expected error"));

    try {
      await getAssetTypes(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "assetType",
      locale,
      limit: 1000,
      skip: 0
    });
  });

  it("should return transformed asset types", async () => {
    const locale = "en-US";
    const assetType = createFullyPopulatedAssetType();
    getEntries.mockResolvedValueOnce(
      createResponse({
        items: [assetType],
        total: 1
      })
    );

    const assetTypes = await getAssetTypes(locale);

    expect(assetTypes).toEqual([
      {
        code: assetType.fields.code,
        name: assetType.fields.name,
        pimCode: assetType.fields.pimCode
      }
    ]);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "assetType",
      locale,
      limit: 1000,
      skip: 0
    });
  });

  it("should paginate and return transformed asset types", async () => {
    const locale = "en-US";
    const assetType = createFullyPopulatedAssetType();
    getEntries.mockResolvedValue(
      createResponse({
        items: [assetType],
        total: 10,
        limit: 1
      })
    );

    const assetTypes = await getAssetTypes(locale);

    expect(assetTypes).toEqual([
      {
        code: assetType.fields.code,
        name: assetType.fields.name,
        pimCode: assetType.fields.pimCode
      }
    ]);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledTimes(10);
    expect(getEntries).toBeCalledWith({
      content_type: "assetType",
      locale,
      limit: 1000,
      skip: 0
    });
    expect(getEntries).lastCalledWith({
      content_type: "assetType",
      locale,
      limit: 1000,
      skip: 9
    });
  });

  it("should ignore asset types without a PIM code", async () => {
    const locale = "en-US";
    const excludeAssetType = createFullyPopulatedAssetType({
      fields: {
        pimCode: undefined
      }
    });
    const includeAssetType = createFullyPopulatedAssetType({
      fields: { pimCode: "pimCode" }
    });
    getEntries.mockResolvedValueOnce(
      createResponse({
        items: [excludeAssetType, includeAssetType],
        total: 2
      })
    );

    const assetTypes = await getAssetTypes(locale);

    expect(assetTypes).toEqual([
      {
        code: includeAssetType.fields.code,
        name: includeAssetType.fields.name,
        pimCode: includeAssetType.fields.pimCode
      }
    ]);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).lastCalledWith({
      content_type: "assetType",
      locale,
      skip: 0,
      limit: 1000
    });
  });

  it("should filter by tag if provided", async () => {
    const locale = "en-US";
    const tag = "contentful-tag";
    const assetType = createFullyPopulatedAssetType();
    getEntries.mockResolvedValueOnce(
      createResponse({ items: [assetType], total: 1 })
    );

    const assetTypes = await getAssetTypes(locale, tag);

    expect(assetTypes).toEqual([
      {
        code: assetType.fields.code,
        name: assetType.fields.name,
        pimCode: assetType.fields.pimCode
      }
    ]);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "assetType",
      locale,
      "metadata.tags.sys.id[all]": tag,
      skip: 0,
      limit: 1000
    });
  });
});

describe("getProductDocumentNameMap", () => {
  it("should throw error if getContentfulClient throws error", async () => {
    const locale = "en-US";
    getContentfulClient.mockImplementationOnce(() => {
      throw Error("Expected error");
    });

    try {
      await getProductDocumentNameMap(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toBeCalled();
    expect(getEntries).not.toBeCalled();
  });

  it("should throw error if getEntries throws error", async () => {
    const locale = "en-US";
    getEntries.mockRejectedValueOnce(Error("Expected error"));

    try {
      await getProductDocumentNameMap(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "resources",
      limit: 1,
      locale
    });
  });

  it("should throw error if getEntries returns empty response", async () => {
    const locale = "en-US";
    getEntries.mockResolvedValueOnce(createResponse({ items: [] }));

    try {
      await getProductDocumentNameMap(locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Unable to find resources.");
    }

    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "resources",
      limit: 1,
      locale
    });
  });

  it("should return productDocumentNameMap value from resource", async () => {
    const locale = "en-US";
    const resource = createFullyPopulatedResources({
      fields: { productDocumentNameMap: "Product name + asset type" }
    });
    getEntries.mockResolvedValueOnce(createResponse({ items: [resource] }));

    const productDocumentMap = await getProductDocumentNameMap(locale);

    expect(productDocumentMap).toEqual(resource.fields.productDocumentNameMap);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "resources",
      limit: 1,
      locale
    });
  });

  it("should return 'Document name' if resource is missing productDocumentNameMap", async () => {
    const locale = "en-US";
    const resource = createFullyPopulatedResources({
      fields: { productDocumentNameMap: undefined }
    });
    getEntries.mockResolvedValueOnce(createResponse({ items: [resource] }));

    const productDocumentMap = await getProductDocumentNameMap(locale);

    expect(productDocumentMap).toEqual("Document name");
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "resources",
      limit: 1,
      locale
    });
  });

  it("should filter by tag if provided", async () => {
    const locale = "en-US";
    const tag = "contentful-tag";
    const resource = createFullyPopulatedResources();
    getEntries.mockResolvedValueOnce(createResponse({ items: [resource] }));

    const productDocumentMap = await getProductDocumentNameMap(locale, tag);

    expect(productDocumentMap).toEqual(resource.fields.productDocumentNameMap);
    expect(getContentfulClient).toBeCalled();
    expect(getEntries).toBeCalledWith({
      content_type: "resources",
      limit: 1,
      locale,
      "metadata.tags.sys.id[all]": tag
    });
  });
});
