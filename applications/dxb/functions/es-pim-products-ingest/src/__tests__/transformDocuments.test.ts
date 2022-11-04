import { createAssetType } from "@bmi/contentful-types";
import {
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import {
  Category,
  createAsset,
  createClassification,
  createProduct,
  createSystem,
  Product,
  System
} from "@bmi/pim-types";
import { ProductDocumentNameMap } from "../types";

const transformDocuments = async (
  item: Product | System,
  locale: string,
  tag?: string
): Promise<(PimProductDocument | PimSystemDocument)[]> =>
  (await import("../transformDocuments")).transformDocuments(item, locale, tag);

jest.mock("uuid", () => ({
  v4: () => "uniqueId"
}));

const getAssetTypes = jest.fn();
const getProductDocumentNameMap = jest.fn();
jest.mock("../contentfulApi", () => ({
  getAssetTypes: (
    locale: string,
    tag?: string
  ): Promise<{ name: string; code: string; pimCode: string }> =>
    getAssetTypes(locale, tag),
  getProductDocumentNameMap: (
    locale: string,
    tag?: string
  ): Promise<ProductDocumentNameMap> => getProductDocumentNameMap(locale, tag)
}));

const getCategoryFilters = jest.fn();
const getClassificationsFilters = jest.fn();
jest.mock("../utils/filterHelpers", () => ({
  getCategoryFilters: (categories: readonly Category[]) =>
    getCategoryFilters(categories),
  getClassificationsFilters: (product: Product) =>
    getClassificationsFilters(product)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("transformDocuments", () => {
  it("should throw error if getAssetType throws error", async () => {
    const locale = "en-US";
    getAssetTypes.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocuments(createProduct(), locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).not.toHaveBeenCalled();
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array if no asset types returned from Contentful", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([]);

    const transformedDocuments = await transformDocuments(
      createProduct(),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).not.toHaveBeenCalled();
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should throw error if getProductDocumentNameMap throws error", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createAssetType()]);
    getProductDocumentNameMap.mockRejectedValueOnce(Error("Expected error"));

    try {
      await transformDocuments(createProduct(), locale);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product has undefined assets", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({ assets: undefined }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when system has undefined assets", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createSystem({ assets: undefined }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product has empty assets array", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({ assets: [] }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when system has empty assets array", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createSystem({ assets: [] }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product asset type isn't found in asset types from Contentful", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([
      createAssetType({ pimCode: "ASSEMBLY_INSTRUCTIONS" })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({ assets: [createAsset({ assetType: "AWARDS" })] }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product asset doesn't have a URL", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({
        assets: [createAsset({ assetType: pimCode, url: undefined })]
      }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM link document if asset is not allowed to download", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document if asset file size is greater than 40MB", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, fileSize: 41943041 })]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 41943041,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_41943041",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document if asset file size is 0", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, fileSize: 0 })]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 0,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_0",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document if asset doesn't have a real file name", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, realFileName: undefined })]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document without classifications for system assets", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [
        createAsset({
          assetType: pimCode,
          allowedToDownload: false
        })
      ],
      classifications: [createClassification()]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(system.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM link document without category filters if there are no product categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document without category filters if there are no system categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM link document without classifications filters if there are no product classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM link document without classifications filters if there are no system classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(system.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM link document with product name and asset type as the title if productDocumentNameMap is 'Product name + asset type'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce(
      "Product name + asset type"
    );
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(
      `${product.name} ${assetType.name}`
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document with asset name as the title if productDocumentNameMap is 'Document name'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const asset = createAsset({
      assetType: pimCode,
      allowedToDownload: false,
      name: "asset-name"
    });
    const product = createProduct({
      assets: [asset]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(asset.name);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM link document with product name and asset type as the title if productDocumentNameMap is 'Document name' but is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          allowedToDownload: false,
          name: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(
      `${product.name} ${assetType.name}`
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should filter asset types and product name map for link documents by tag if provided", async () => {
    const locale = "en-US";
    const tag = "market__norway";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          allowedToDownload: false
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale, tag);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": true,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, tag);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, tag);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document using real file name to get pdf format if mime is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          realFileName: "file-name.pdf",
          mime: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("application/pdf");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document using real file name to get jpg format if mime is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          realFileName: "file-name.jpg",
          mime: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("image/jpg");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document using real file name to get jpeg format if mime is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          realFileName: "file-name.jpeg",
          mime: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("image/jpeg");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document using real file name to get png format if mime is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          realFileName: "file-name.png",
          mime: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("image/png");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document with undefined format if no mime and the real file name has an unknown type", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          realFileName: "file-name.bin",
          mime: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual(undefined);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document without classifications for system assets", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [
        createAsset({
          assetType: pimCode
        })
      ],
      classifications: [createClassification()]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(system.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM document without category filters if there are no product categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "APPEARANCEATTRIBUTES.COLOUR": Object {
            "code": "red",
            "name": "red",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document without category filters if there are no system categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM document without classifications filters if there are no product classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM document without classifications filters if there are no system classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(system.categories);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return PIM document with product name and asset type as the title if productDocumentNameMap is 'Product name + asset type'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce(
      "Product name + asset type"
    );
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(
      `${product.name} ${assetType.name}`
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document with asset name as the title if productDocumentNameMap is 'Document name'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const asset = createAsset({
      assetType: pimCode,
      name: "asset-name"
    });
    const product = createProduct({
      assets: [asset]
    });
    getAssetTypes.mockResolvedValueOnce([createAssetType({ pimCode })]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(asset.name);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should return PIM document with product name and asset type as the title if productDocumentNameMap is 'Document name' but is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          name: undefined
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(
      `${product.name} ${assetType.name}`
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });

  it("should filter asset types and product name map for documents by tag if provided", async () => {
    const locale = "en-US";
    const tag = "market__norway";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createAssetType({ pimCode });
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode
        })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale, tag);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      Array [
        Object {
          "BRAND": Object {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "assetType": Object {
            "code": "contentful asset type code",
            "name": "contentful asset type name",
            "pimCode": "ASSEMBLY_INSTRUCTIONS",
          },
          "extension": "pdf",
          "fileSize": 10,
          "format": "application/pdf",
          "id": "uniqueId",
          "isLinkDocument": false,
          "noIndex": false,
          "productBaseCode": "base-code",
          "productName": "name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, tag);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, tag);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(product);
  });
});
