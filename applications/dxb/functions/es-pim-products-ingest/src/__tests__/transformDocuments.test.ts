import {
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import {
  ApprovalStatus,
  Category,
  Classification,
  createAsset,
  createClassification,
  createProduct,
  createSystem,
  createVariantOption,
  Product,
  System
} from "@bmi/pim-types";
import { ContentfulAssetType, ProductDocumentNameMap } from "../types";

const createContentfulAssetType = (
  contentfulAssetType?: Partial<ContentfulAssetType>
): ContentfulAssetType => ({
  code: "contentful asset type code",
  name: "contentful asset type name",
  pimCode: "pim-code",
  ...contentfulAssetType
});

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
  getClassificationsFilters: (
    productClassifications?: Classification[],
    variantClassifications?: Classification[]
  ) => getClassificationsFilters(productClassifications, variantClassifications)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
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

  it("should return an array of documents if the product's approval status is 'approved'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Approved,
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments.length).toBe(1);
    expect(transformedDocuments[0]["approvalStatus"]).toEqual(
      ApprovalStatus.Approved
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
  });

  it("should return an array of documents if the product's approval status is 'discontinued'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Discontinued,
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments.length).toBe(1);
    expect(transformedDocuments[0]["approvalStatus"]).toEqual(
      ApprovalStatus.Discontinued
    );
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
  });

  it("should return an empty array if the product's approval status is 'unapproved'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Unapproved,
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(transformedDocuments).toEqual([]);
  });

  it("should return an empty array if the product's approval status is 'preview'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(transformedDocuments).toEqual([]);
  });

  it("should return an empty array if the base product's approval status is approved and the variant status is preview", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Approved,
      assets: [createAsset({ assetType: pimCode })],
      variantOptions: [
        createVariantOption({ approvalStatus: ApprovalStatus.Preview })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(transformedDocuments).toEqual([]);
  });

  it("should return an empty array if the base product's approval status is discontinued and the variant status is preview", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Discontinued,
      assets: [createAsset({ assetType: pimCode })],
      variantOptions: [
        createVariantOption({ approvalStatus: ApprovalStatus.Preview })
      ]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(transformedDocuments).toEqual([]);
  });

  it("should return an empty array if the product's approval status is 'check'", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      approvalStatus: ApprovalStatus.Check,
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);

    const transformedDocuments = await transformDocuments(product, locale);

    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(transformedDocuments).toEqual([]);
  });

  it("should throw error if getProductDocumentNameMap throws error", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createContentfulAssetType()]);
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

  it("should return empty array when product has undefined assets and no variants", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createContentfulAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({ assets: undefined, variantOptions: undefined }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when system has undefined assets", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createContentfulAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createSystem({ assets: undefined }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product has empty assets array and no variants", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createContentfulAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({ assets: [], variantOptions: undefined }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when system has empty assets array", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([createContentfulAssetType()]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createSystem({ assets: [] }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when system does not have a URL", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createSystem({
        assets: [createAsset({ assetType: pimCode, url: undefined })]
      }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getClassificationsFilters).not.toHaveBeenCalled();
  });

  it("should return empty array when product asset type isn't found in asset types from Contentful", async () => {
    const locale = "en-US";
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({
        assets: [createAsset({ assetType: "AWARDS" })],
        variantOptions: [createVariantOption({ assets: [] })]
      }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
  });

  it("should return empty array when product asset doesn't have a URL", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(
      createProduct({
        assets: [createAsset({ assetType: pimCode, url: undefined })],
        variantOptions: [createVariantOption({ assets: [] })]
      }),
      locale
    );

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
  });

  it("should return PIM link document if asset is not allowed to download", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM link document if asset file size is greater than 40MB", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, fileSize: 41943041 })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_41943041",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM link document if asset file size is 0", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, fileSize: 0 })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_0",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should not return PIM link document if asset file size is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, fileSize: undefined })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toEqual([]);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
  });

  it("should return PIM link document if asset doesn't have a real file name", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode, realFileName: undefined })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM link document without category filters if there are no system categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
      classifications: undefined,
      variantOptions: [createVariantOption({ classifications: undefined })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
  });

  it("should return PIM link document without classifications filters if there are no system classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode, allowedToDownload: false })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
    const assetType = createContentfulAssetType({ pimCode });
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(asset.name);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM link document with product name and asset type as the title if productDocumentNameMap is 'Document name' but is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should filter asset types and product name map for link documents by tag if provided", async () => {
    const locale = "en-US";
    const tag = "market__norway";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
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
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, tag);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, tag);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM document", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const product = createProduct({
      assets: [createAsset({ assetType: pimCode })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      APPEARANCEATTRIBUTES$COLOUR: { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("image/jpeg");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      APPEARANCEATTRIBUTES$COLOUR: { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].format).toEqual("image/png");
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getClassificationsFilters.mockReturnValueOnce({
      "APPEARANCEATTRIBUTES.COLOUR": { code: "red", name: "red" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "APPEARANCEATTRIBUTES.COLOUR": {
            "code": "red",
            "name": "red",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).not.toHaveBeenCalled();
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM document without category filters if there are no system categories", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode })],
      categories: undefined
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
      classifications: undefined,
      variantOptions: [createVariantOption({ classifications: undefined })]
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
  });

  it("should return PIM document without classifications filters if there are no system classifications", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const system = createSystem({
      assets: [createAsset({ assetType: pimCode })],
      classifications: undefined
    });
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(system, locale);

    expect(transformedDocuments).toMatchInlineSnapshot(`
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMSystemDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "validUntil": undefined,
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
    const assetType = createContentfulAssetType({ pimCode });
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
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
    getAssetTypes.mockResolvedValueOnce([
      createContentfulAssetType({ pimCode })
    ]);
    getProductDocumentNameMap.mockResolvedValueOnce("Document name");
    getCategoryFilters.mockReturnValueOnce({
      BRAND: { code: "BMI", name: "BMI" }
    });

    const transformedDocuments = await transformDocuments(product, locale);

    expect(transformedDocuments[0].title).toEqual(asset.name);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, undefined);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, undefined);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return PIM document with product name and asset type as the title if productDocumentNameMap is 'Document name' but is undefined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
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
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should filter asset types and product name map for documents by tag if provided", async () => {
    const locale = "en-US";
    const tag = "market__norway";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
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
      [
        {
          "BRAND": {
            "code": "BMI",
            "name": "BMI",
          },
          "__typename": "PIMDocument",
          "approvalStatus": "approved",
          "assetType": {
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
          "productName": "variant-name",
          "realFileName": "real-file-name.pdf",
          "title": "name",
          "titleAndSize": "name_10",
          "url": "http://localhost:8000",
          "validUntil": undefined,
        },
      ]
    `);
    expect(getAssetTypes).toHaveBeenCalledWith(locale, tag);
    expect(getProductDocumentNameMap).toHaveBeenCalledWith(locale, tag);
    expect(getCategoryFilters).toHaveBeenCalledWith(product.categories);
    expect(getClassificationsFilters).toHaveBeenCalledWith(
      product.classifications,
      product.variantOptions?.[0].classifications
    );
  });

  it("should return empty array when product does not have variants", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      variantOptions: undefined
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments.length).toBe(0);
  });

  it("should return an empty array when base product and variants do not have assets", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      variantOptions: [createVariantOption({ assets: undefined })],
      assets: undefined
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments.length).toBe(0);
  });

  it("should return assets of base product if variant does not have any assets", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      variantOptions: [createVariantOption({ assets: undefined })],
      assets: [
        createAsset({ assetType: pimCode, realFileName: "Base product asset" })
      ]
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments.length).toBe(1);
    expect(transformedDocuments[0].realFileName).toBe("Base product asset");
  });

  it("should return assets with base product's name if variant does not have name field", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    getProductDocumentNameMap.mockResolvedValue("Product name + asset type");
    const assetType = createContentfulAssetType({
      pimCode,
      name: "ASSEMBLY INSTRUCTIONS"
    });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      variantOptions: [
        createVariantOption({
          name: undefined,
          assets: [createAsset({ assetType: pimCode })]
        })
      ],
      name: "Base product name",
      assets: undefined
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments.length).toBe(1);
    expect(transformedDocuments[0].title).toBe(
      `${product.name} ASSEMBLY INSTRUCTIONS`
    );
  });

  it("should return validUntil field as timestamp", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      assets: [
        createAsset({
          assetType: pimCode,
          validUntil: "2023-08-03T08:23:59+0000"
        })
      ]
    });

    const expectedResult = new Date("2023-08-03T08:23:59+0000").getTime();
    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments[0].validUntil).toBe(expectedResult);
  });

  it("should return an empty array if both assets and categoryAssets fields are not defined for product", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      assets: undefined,
      categoryAssets: undefined,
      variantOptions: [
        createVariantOption({ assets: undefined, categoryAssets: undefined })
      ]
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments).toEqual([]);
  });

  it("should return an empty array if both assets and categoryAssets fields are not defined for system", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createSystem({
      assets: undefined,
      categoryAssets: undefined
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments).toEqual([]);
  });

  it("should use categoryAssets of variant product if provided", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const variantCategoryAsset = createAsset({
      name: "variant category asset",
      assetType: pimCode
    });
    const baseProductCategoryAsset = createAsset({
      name: "base product category asset",
      assetType: pimCode
    });
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      assets: [],
      categoryAssets: [baseProductCategoryAsset],
      variantOptions: [
        createVariantOption({
          assets: [],
          categoryAssets: [variantCategoryAsset]
        })
      ]
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments).toEqual([
      {
        __typename: "PIMDocument",
        approvalStatus: "approved",
        assetType: {
          code: "contentful asset type code",
          name: "contentful asset type name",
          pimCode: "ASSEMBLY_INSTRUCTIONS"
        },
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: "uniqueId",
        isLinkDocument: false,
        noIndex: false,
        productBaseCode: "base-code",
        productName: "variant-name",
        realFileName: "real-file-name.pdf",
        title: undefined,
        titleAndSize: "variant category asset_10",
        url: "http://localhost:8000",
        validUntil: undefined
      }
    ]);
  });

  it("should use categoryAssets of base product if categoryAssets of variant product are not defined", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const baseProductCategoryAsset = createAsset({
      name: "base product category asset",
      assetType: pimCode
    });
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createProduct({
      assets: [],
      categoryAssets: [baseProductCategoryAsset],
      variantOptions: [
        createVariantOption({
          assets: [],
          categoryAssets: undefined
        })
      ]
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments).toEqual([
      {
        __typename: "PIMDocument",
        approvalStatus: "approved",
        assetType: {
          code: "contentful asset type code",
          name: "contentful asset type name",
          pimCode: "ASSEMBLY_INSTRUCTIONS"
        },
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: "uniqueId",
        isLinkDocument: false,
        noIndex: false,
        productBaseCode: "base-code",
        productName: "variant-name",
        realFileName: "real-file-name.pdf",
        title: undefined,
        titleAndSize: "base product category asset_10",
        url: "http://localhost:8000",
        validUntil: undefined
      }
    ]);
  });

  it("should return documents correctly if system has both assets and categoryAssets fields", async () => {
    const locale = "en-US";
    const pimCode = "ASSEMBLY_INSTRUCTIONS";
    const assetType = createContentfulAssetType({ pimCode });
    getAssetTypes.mockResolvedValueOnce([assetType]);
    const product = createSystem({
      assets: [createAsset({ name: "system asset" })],
      categoryAssets: [createAsset({ name: "system category asset" })]
    });

    const transformedDocuments = await transformDocuments(product, locale);
    expect(transformedDocuments).toEqual([
      {
        __typename: "PIMSystemDocument",
        approvalStatus: "approved",
        assetType: {
          code: "contentful asset type code",
          name: "contentful asset type name",
          pimCode: "ASSEMBLY_INSTRUCTIONS"
        },
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: "uniqueId",
        isLinkDocument: false,
        noIndex: false,
        realFileName: "real-file-name.pdf",
        title: undefined,
        titleAndSize: "system asset_10",
        url: "http://localhost:8000",
        validUntil: undefined
      },
      {
        __typename: "PIMSystemDocument",
        approvalStatus: "approved",
        assetType: {
          code: "contentful asset type code",
          name: "contentful asset type name",
          pimCode: "ASSEMBLY_INSTRUCTIONS"
        },
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: "uniqueId",
        isLinkDocument: false,
        noIndex: false,
        realFileName: "real-file-name.pdf",
        title: undefined,
        titleAndSize: "system category asset_10",
        url: "http://localhost:8000",
        validUntil: undefined
      }
    ]);
  });
});
