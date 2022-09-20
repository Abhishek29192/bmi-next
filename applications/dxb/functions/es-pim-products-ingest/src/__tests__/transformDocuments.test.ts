import {
  EsPIMDocumentData,
  EsPIMLinkDocumentData
} from "@bmi/elasticsearch-types";
import {
  AssetTypeData,
  Category,
  createAsset,
  createClassification,
  createFeature,
  createProduct,
  createVariantOption,
  Product,
  System
} from "@bmi/pim-types";
import { ProductDocumentNameMap } from "../types";

const transformDocuments = async (
  item: Product | System
): Promise<(EsPIMDocumentData | EsPIMLinkDocumentData)[] | undefined> =>
  (await import("../transformDocuments")).transformDocuments(
    item as Product | System
  );

jest.mock("uuid", () => ({
  v4: () => "uniqueId"
}));

const getAssetTypes = jest.fn();
const getProductDocumentNameMap = jest.fn();
jest.mock("../contentfulApi", () => ({
  getAssetTypes: (): Promise<
    Pick<AssetTypeData, "name" | "code" | "pimCode">[] | undefined
  > => getAssetTypes(),
  getProductDocumentNameMap: (): Promise<ProductDocumentNameMap | undefined> =>
    getProductDocumentNameMap()
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const categories: Category[] = [
  {
    categoryType: "Category",
    code: "parent-category-code",
    image: {
      allowedToDownload: true,
      fileSize: 10,
      mime: "image/png",
      name: "name",
      realFileName: "real-file-name.png",
      url: "http://localhost:8000"
    },
    name: "name",
    parentCategoryCode: ""
  }
];

describe("transformDocuments", () => {
  it("should transform asset into PimDocument", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.pdf",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should return empty array if product does NOT have assets", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: undefined,
      categories
    });
    const result = await transformDocuments(product);
    expect(result).toEqual([]);
  });

  it("should transform asset into PimLinkDocument", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [
        createAsset({ assetType: "AWARDS", realFileName: "", fileSize: 0 })
      ],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMLinkDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        id: `uniqueId`,
        isLinkDocument: true,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        title: "name name2",
        url: "http://localhost:8000"
      }
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should transform asset into PimLinkDocument if allowedToDownload === false", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [
        createAsset({
          assetType: "AWARDS",
          allowedToDownload: false
        })
      ],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMLinkDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        id: `uniqueId`,
        isLinkDocument: true,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        title: "name name2",
        url: "http://localhost:8000"
      }
    ];

    expect(result).toEqual(expectedResult);
  });
  it("should transform asset into PimLinkDocument if fileSize is bigger than 40mb", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [
        createAsset({
          assetType: "AWARDS",
          fileSize: 41943041
        })
      ],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMLinkDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        id: `uniqueId`,
        isLinkDocument: true,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        title: "name name2",
        url: "http://localhost:8000"
      }
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should NOT return document with asset type which is NOT match contenful assetTypes", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "pimCode"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");

    const product = createProduct({
      assets: [createAsset({ assetType: "BIM" })]
    });
    const result = await transformDocuments(product);

    expect(result).toEqual([]);
  });

  it("should NOT return document with asset type which is match contenful assetTypes but url is NOT provided", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "BIM"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "BIM", url: "" })]
    });
    const result = await transformDocuments(product);

    expect(result).toEqual([]);
  });

  it("should NOT return document if fileSize is NOT provided", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "BIM"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "BIM", fileSize: 0 })]
    });
    const result = await transformDocuments(product);
    expect(result).toEqual([]);
  });

  it("should NOT return document which has fileSize but realFileName is NOT provided", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "BIM"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "BIM", realFileName: "" })]
    });
    const result = await transformDocuments(product);

    expect(result).toEqual([]);
  });

  it("should resolve document format from realFileName if mime is NOT provided", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [
        createAsset({
          assetType: "AWARDS",
          mime: undefined,
          realFileName: "real-file-name.jpg"
        })
      ],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "jpg",
        fileSize: 10,
        format: "image/jpg",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.jpg",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should assign title to `item.name assetType.name` if asset name is NOT provided", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Document name");
    const product = createProduct({
      name: "TEST",
      assets: [createAsset({ assetType: "AWARDS", name: "" })],
      categories
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "TEST",
        realFileName: "real-file-name.pdf",
        title: "TEST name2",
        titleAndSize: "_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should transform asset into PimDocument with classification filters", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      categories,
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily"
                })
              ]
            })
          ]
        })
      ]
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [
          {
            code: "code",
            name: "value"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.pdf",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should transform asset into PimDocument with classification filters even if base product does NOT have classifications", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      categories,
      classifications: undefined,
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily"
                })
              ]
            })
          ]
        })
      ]
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [
          {
            code: "code",
            name: "value"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.pdf",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should transform asset into PimDocument without classification filters when there are no classifications", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      categories,
      classifications: undefined,
      variantOptions: [
        createVariantOption({
          classifications: undefined
        })
      ]
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        CATEGORY: [
          {
            code: "parent-category-code",
            name: "name"
          }
        ],
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.pdf",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should transform asset into PimDocument without category filters when there are no categories", async () => {
    const assetTypes = [
      {
        name: "name1",
        code: "code1",
        pimCode: "ASSEMBLY_INSTRUCTIONS"
      },
      {
        name: "name2",
        code: "code2",
        pimCode: "AWARDS"
      }
    ];
    getAssetTypes.mockReturnValue(assetTypes);
    getProductDocumentNameMap.mockReturnValue("Product name + asset type");
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      categories: undefined
    });
    const result = await transformDocuments(product);
    const expectedResult = [
      {
        __typename: "PIMDocument",
        assetType: { code: "code2", name: "name2", pimCode: "AWARDS" },
        docName: "name",
        extension: "pdf",
        fileSize: 10,
        format: "application/pdf",
        id: `uniqueId`,
        isLinkDocument: false,
        noIndex: false,
        productBaseCode: "base-code",
        productName: "name",
        realFileName: "real-file-name.pdf",
        title: "name name2",
        titleAndSize: "name_10",
        url: "http://localhost:8000"
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});
