import {
  createCategory,
  createProduct,
  createProductDocument,
  Product as FirestoreProduct
} from "@bmi/firestore-types";
import Product from "../Product";
import { Context, Node } from "../types/Gatsby";

jest.mock("../utils/path", () => ({
  ...(jest.requireActual("../utils/path") as any),
  resolvePath: jest
    .fn()
    .mockResolvedValue([
      { id: "page", label: "label", slug: "product-family-slug" }
    ])
}));

jest.mock("../utils/getDefaultYoutubePreviewImage", () => ({
  getDefaultYoutubePreviewImage: () =>
    "https://i.ytimg.com/vi/3901c0ds7oo/maxresdefault.jpg"
}));

const findAll = jest.fn();
const findOne = jest.fn();
const context: Context = {
  nodeModel: {
    getNodeById: jest.fn(),
    getNodesByIds: jest.fn(),
    findAll,
    findOne
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("resolve productDocuments", () => {
  describe("When product's documents are null", () => {
    it("returns empty list", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });
      const relatedDocuments = [];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: null
      });

      findOne.mockReturnValue({ keyAssetTypes: ["ASSEMBLY_INSTRUCTIONS"] });

      const returnedProductDocuments = await Product.productDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedProductDocuments).toEqual(relatedDocuments);

      expect(findOne).not.toHaveBeenCalled();
    });
  });
  describe("When product's documents are NOT null", () => {
    describe("And document display format is 'Asset name'", () => {
      describe("And document has invalid pimcodes", () => {
        it("returns empty documents list", async () => {
          findAll.mockResolvedValueOnce({
            entries: [
              { pimCode: "BMI" },
              { pimCode: "ASSEMBLY_INSTRUCTIONS" },
              { pimCode: "CERTIFICATES" }
            ]
          });
          findOne.mockResolvedValueOnce({
            documentDisplayFormat: "Asset name"
          });
          const productFamily = createCategory({
            categoryType: "ProductFamily"
          });

          const relatedDoc1 = createProductDocument({ assetType: "BIM" });
          const relatedDoc2 = createProductDocument({
            assetType: "FIXING_TOOL"
          });
          const relatedDoc3 = createProductDocument({
            assetType: "SPECIFICATION"
          });
          const relatedDoc4 = createProductDocument({
            assetType: "VIDEO"
          });
          const source: FirestoreProduct = createProduct({
            categories: [productFamily],
            documents: [relatedDoc1, relatedDoc2, relatedDoc3, relatedDoc4]
          });

          const returnedProductDocuments =
            await Product.productDocuments.resolve(source, null, context);

          expect(returnedProductDocuments).toEqual([]);

          expect(findOne).toHaveBeenCalledWith(
            {
              query: { filter: {} },
              type: "ContentfulResources"
            },
            { connectionType: "ContentfulResources" }
          );
        });
      });
      describe("And document has valid pimcodes", () => {
        it("returns filtered documents list", async () => {
          findAll.mockResolvedValueOnce({
            entries: [
              { pimCode: "BMI" },
              { pimCode: "ASSEMBLY_INSTRUCTIONS" },
              { pimCode: "CERTIFICATES" }
            ]
          });
          findOne.mockResolvedValueOnce({
            documentDisplayFormat: "Asset name"
          });
          const productFamily = createCategory({
            categoryType: "ProductFamily"
          });

          const relatedDoc1 = createProductDocument({ assetType: "BIM" });
          const relatedDoc2 = createProductDocument({
            assetType: "FIXING_TOOL"
          });
          const relatedDoc3 = createProductDocument({
            assetType: "SPECIFICATION"
          });
          const relatedDoc4 = createProductDocument({
            assetType: "VIDEO"
          });
          const relatedDoc5 = createProductDocument({
            assetType: "ASSEMBLY_INSTRUCTIONS"
          });
          const relatedDoc6 = createProductDocument({
            assetType: "CERTIFICATES"
          });
          const source: FirestoreProduct = createProduct({
            categories: [productFamily],
            documents: [
              relatedDoc1,
              relatedDoc2,
              relatedDoc3,
              relatedDoc4,
              relatedDoc5,
              relatedDoc6
            ]
          });

          const returnedProductDocuments =
            await Product.productDocuments.resolve(source, null, context);

          expect(returnedProductDocuments).toEqual([
            {
              assetType: {
                pimCode: "ASSEMBLY_INSTRUCTIONS"
              },
              extension: "pdf",
              fileSize: 10,
              format: "application/pdf",
              id: "id-1",
              internal: {
                owner: "@bmi/resolvers",
                type: "PIMDocument"
              },
              isLinkDocument: false,
              productBaseCode: "product-base-code",
              productName: "Product Name",
              realFileName: "real-file-name.pdf",
              title: "title",
              url: "http://localhost:8000/real-file-name.pdf"
            },
            {
              assetType: {
                pimCode: "CERTIFICATES"
              },
              extension: "pdf",
              fileSize: 10,
              format: "application/pdf",
              id: "id-1",
              internal: {
                owner: "@bmi/resolvers",
                type: "PIMDocument"
              },
              isLinkDocument: false,
              productBaseCode: "product-base-code",
              productName: "Product Name",
              realFileName: "real-file-name.pdf",
              title: "title",
              url: "http://localhost:8000/real-file-name.pdf"
            }
          ]);

          expect(findOne).toHaveBeenCalledWith(
            {
              query: { filter: {} },
              type: "ContentfulResources"
            },
            { connectionType: "ContentfulResources" }
          );
        });
      });
    });
    describe("And document display format is 'Asset Type'", () => {
      describe("And document has invalid pimcodes", () => {
        it("returns empty documents list", async () => {
          findAll.mockResolvedValueOnce({
            entries: [
              { pimCode: "BMI" },
              { pimCode: "ASSEMBLY_INSTRUCTIONS" },
              { pimCode: "CERTIFICATES" }
            ]
          });
          findOne.mockResolvedValueOnce({
            documentDisplayFormat: "Asset Type"
          });
          const productFamily = createCategory({
            categoryType: "ProductFamily"
          });

          const relatedDoc1 = createProductDocument({ assetType: "BIM" });
          const relatedDoc2 = createProductDocument({
            assetType: "FIXING_TOOL"
          });
          const relatedDoc3 = createProductDocument({
            assetType: "SPECIFICATION"
          });
          const relatedDoc4 = createProductDocument({
            assetType: "VIDEO"
          });
          const source: FirestoreProduct = createProduct({
            categories: [productFamily],
            documents: [relatedDoc1, relatedDoc2, relatedDoc3, relatedDoc4]
          });

          const returnedProductDocuments =
            await Product.productDocuments.resolve(source, null, context);

          expect(returnedProductDocuments).toEqual([]);

          expect(findOne).toHaveBeenCalledWith(
            {
              query: { filter: {} },
              type: "ContentfulResources"
            },
            { connectionType: "ContentfulResources" }
          );
        });
      });
      describe("And document has valid pimcodes", () => {
        describe("And there are multiple documents with same pim codes", () => {
          it("returns filtered grouped documents list", async () => {
            findAll.mockResolvedValueOnce({
              entries: [
                { pimCode: "BMI" },
                { pimCode: "ASSEMBLY_INSTRUCTIONS" },
                { pimCode: "CERTIFICATES" }
              ]
            });
            findOne.mockResolvedValueOnce({
              documentDisplayFormat: "Asset Type"
            });
            const productFamily = createCategory({
              categoryType: "ProductFamily"
            });

            const relatedDoc1 = createProductDocument({
              assetType: "BIM"
            });
            const relatedDoc2 = createProductDocument({
              assetType: "FIXING_TOOL"
            });
            const relatedDoc3 = createProductDocument({
              assetType: "SPECIFICATION"
            });
            const relatedDoc4 = createProductDocument({
              assetType: "VIDEO"
            });
            const relatedDoc5 = createProductDocument({
              assetType: "ASSEMBLY_INSTRUCTIONS"
            });
            const relatedDoc6 = createProductDocument({
              assetType: "CERTIFICATES"
            });
            const relatedDoc7 = createProductDocument({
              assetType: "CERTIFICATES"
            });
            const source: FirestoreProduct = createProduct({
              categories: [productFamily],
              documents: [
                relatedDoc1,
                relatedDoc2,
                relatedDoc3,
                relatedDoc5,
                relatedDoc4,
                relatedDoc5,
                relatedDoc6,
                relatedDoc7
              ]
            });

            const returnedProductDocuments =
              await Product.productDocuments.resolve(source, null, context);

            expect(returnedProductDocuments).toEqual([
              {
                __typename: "PIMDocumentWithPseudoZip",
                assetType: {
                  pimCode: "ASSEMBLY_INSTRUCTIONS"
                },
                documentList: [
                  {
                    assetType: {
                      pimCode: "ASSEMBLY_INSTRUCTIONS"
                    },
                    extension: "pdf",
                    fileSize: 10,
                    format: "application/pdf",
                    id: "id-1",
                    internal: {
                      owner: "@bmi/resolvers",
                      type: "PIMDocument"
                    },
                    isLinkDocument: false,
                    productBaseCode: "product-base-code",
                    productName: "Product Name",
                    realFileName: "real-file-name.pdf",
                    title: "title",
                    url: "http://localhost:8000/real-file-name.pdf"
                  },
                  {
                    assetType: {
                      pimCode: "ASSEMBLY_INSTRUCTIONS"
                    },
                    extension: "pdf",
                    fileSize: 10,
                    format: "application/pdf",
                    id: "id-1",
                    internal: {
                      owner: "@bmi/resolvers",
                      type: "PIMDocument"
                    },
                    isLinkDocument: false,
                    productBaseCode: "product-base-code",
                    productName: "Product Name",
                    realFileName: "real-file-name.pdf",
                    title: "title",
                    url: "http://localhost:8000/real-file-name.pdf"
                  }
                ],
                fileSize: 20,
                format: "application/zip",
                id: "3674450835",
                internal: {
                  owner: "@bmi/resolvers",
                  type: "PIMDocumentWithPseudoZip"
                },
                isLinkDocument: false,
                productBaseCode: "product-base-code",
                productName: "Product Name",
                title: "ASSEMBLY_INSTRUCTIONS"
              },
              {
                __typename: "PIMDocumentWithPseudoZip",
                assetType: {
                  pimCode: "CERTIFICATES"
                },
                documentList: [
                  {
                    assetType: {
                      pimCode: "CERTIFICATES"
                    },
                    extension: "pdf",
                    fileSize: 10,
                    format: "application/pdf",
                    id: "id-1",
                    internal: {
                      owner: "@bmi/resolvers",
                      type: "PIMDocument"
                    },
                    isLinkDocument: false,
                    productBaseCode: "product-base-code",
                    productName: "Product Name",
                    realFileName: "real-file-name.pdf",
                    title: "title",
                    url: "http://localhost:8000/real-file-name.pdf"
                  },
                  {
                    assetType: {
                      pimCode: "CERTIFICATES"
                    },
                    extension: "pdf",
                    fileSize: 10,
                    format: "application/pdf",
                    id: "id-1",
                    internal: {
                      owner: "@bmi/resolvers",
                      type: "PIMDocument"
                    },
                    isLinkDocument: false,
                    productBaseCode: "product-base-code",
                    productName: "Product Name",
                    realFileName: "real-file-name.pdf",
                    title: "title",
                    url: "http://localhost:8000/real-file-name.pdf"
                  }
                ],
                fileSize: 20,
                format: "application/zip",
                id: "2833580601",
                internal: {
                  owner: "@bmi/resolvers",
                  type: "PIMDocumentWithPseudoZip"
                },
                isLinkDocument: false,
                productBaseCode: "product-base-code",
                productName: "Product Name",
                title: "CERTIFICATES"
              }
            ]);

            expect(findOne).toHaveBeenCalledWith(
              {
                query: { filter: {} },
                type: "ContentfulResources"
              },
              { connectionType: "ContentfulResources" }
            );
          });
        });
      });
    });
  });
});
describe("resolve key asset documents", () => {
  describe("When product's documents are null", () => {
    it("returns empty list", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });
      const relatedDocuments = [];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: null
      });

      findOne.mockReturnValue({ keyAssetTypes: ["ASSEMBLY_INSTRUCTIONS"] });

      const returnedKeyAssetDocuments = await Product.keyAssetDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedKeyAssetDocuments).toEqual(relatedDocuments);

      expect(findOne).not.toHaveBeenCalled();
    });
  });
  describe("When product does NOT have documents", () => {
    it("returns empty list", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });
      const relatedDocuments = [];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: []
      });

      findOne.mockReturnValue({ keyAssetTypes: ["ASSEMBLY_INSTRUCTIONS"] });

      const returnedKeyAssetDocuments = await Product.keyAssetDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedKeyAssetDocuments).toEqual(relatedDocuments);

      expect(findOne).not.toHaveBeenCalled();
    });
  });
  describe("When resources returns EMPTY asset type", () => {
    it("returns empty documents list", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });

      const relatedDoc1 = createProductDocument();
      const relatedDoc2 = createProductDocument();
      const relatedDoc3 = createProductDocument();
      const relatedDocuments = [];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: [relatedDoc1, relatedDoc2, relatedDoc3]
      });

      findOne.mockReturnValue({ keyAssetTypes: [] });

      const returnedKeyAssetDocuments = await Product.keyAssetDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedKeyAssetDocuments).toEqual(relatedDocuments);

      expect(findOne).toHaveBeenCalledWith(
        {
          query: { filter: {} },
          type: "ContentfulResources"
        },
        { connectionType: "ContentfulAssetType" }
      );
    });
  });
  describe("When resources return single asset type", () => {
    it("returns related document grouped by asset type", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });

      const relatedDoc1 = createProductDocument();
      const relatedDoc2 = createProductDocument();
      const relatedDoc3 = createProductDocument();
      const relatedDocuments = [
        {
          assetType: "ASSEMBLY_INSTRUCTIONS",
          documents: [relatedDoc1, relatedDoc2, relatedDoc3]
        }
      ];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: [relatedDoc1, relatedDoc2, relatedDoc3]
      });

      findOne.mockReturnValue({ keyAssetTypes: ["ASSEMBLY_INSTRUCTIONS"] });

      const returnedKeyAssetDocuments = await Product.keyAssetDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedKeyAssetDocuments).toEqual(relatedDocuments);

      expect(findOne).toHaveBeenCalledWith(
        {
          query: { filter: {} },
          type: "ContentfulResources"
        },
        { connectionType: "ContentfulAssetType" }
      );
    });
  });
  describe("When resources return multiple asset type", () => {
    it("returns related document grouped by multiple asset type", async () => {
      const productFamily = createCategory({ categoryType: "ProductFamily" });

      const relatedDoc1 = createProductDocument();
      const relatedDoc2 = createProductDocument({ assetType: "SPECIFICATION" });
      const relatedDoc3 = createProductDocument();
      const relatedDocuments = [
        {
          assetType: "ASSEMBLY_INSTRUCTIONS",
          documents: [relatedDoc1, relatedDoc3]
        },
        {
          assetType: "SPECIFICATION",
          documents: [relatedDoc2]
        }
      ];
      const source: FirestoreProduct = createProduct({
        categories: [productFamily],
        documents: [relatedDoc1, relatedDoc2, relatedDoc3]
      });

      findOne.mockReturnValue({
        keyAssetTypes: ["ASSEMBLY_INSTRUCTIONS", "SPECIFICATION"]
      });

      const returnedKeyAssetDocuments = await Product.keyAssetDocuments.resolve(
        source,
        null,
        context
      );

      expect(returnedKeyAssetDocuments).toEqual(relatedDocuments);

      expect(findOne).toHaveBeenCalledWith(
        {
          query: { filter: {} },
          type: "ContentfulResources"
        },
        { connectionType: "ContentfulAssetType" }
      );
    });
  });
});

describe("resolve related products", () => {
  it("returns empty array if GATSBY_HIDE_RECOMMENDED_PRODUCTS is true", async () => {
    const originalGatsbyHideRecommendedProducts =
      process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS;
    process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS = "true";

    const source: FirestoreProduct = createProduct({
      categories: [createCategory({ categoryType: "ProductFamily" })]
    });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([]);
    expect(findAll).not.toHaveBeenCalled();

    process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS =
      originalGatsbyHideRecommendedProducts;
  });

  it("returns empty array if source product doesn't have a product family", async () => {
    const source: FirestoreProduct = createProduct({
      categories: [createCategory({ categoryType: "Brand" })]
    });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([]);
    expect(findAll).not.toHaveBeenCalled();
  });

  it("returns empty array when no related products found", async () => {
    const productFamily = createCategory({ categoryType: "ProductFamily" });
    const source: FirestoreProduct = createProduct({
      categories: [productFamily]
    });

    findAll.mockReturnValue({ entries: [] });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([]);
    expect(findAll).toHaveBeenCalledWith({
      query: {
        filter: {
          categories: { elemMatch: { code: { eq: productFamily.code } } }
        }
      },
      type: "Product"
    });
  });

  it("returns related products grouped by name", async () => {
    const productFamily = createCategory({ categoryType: "ProductFamily" });
    const source: FirestoreProduct = createProduct({
      categories: [productFamily]
    });
    const relatedProduct1 = createProduct({ name: "product 1" });
    const relatedProduct2 = createProduct({ name: "product 1" });
    const relatedProduct3 = createProduct({ name: "product 2" });
    const relatedProducts: FirestoreProduct[] = [
      relatedProduct1,
      relatedProduct2,
      relatedProduct3
    ];

    findAll.mockReturnValue({ entries: relatedProducts });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([relatedProduct1, relatedProduct3]);
    expect(findAll).toHaveBeenCalledWith({
      query: {
        filter: {
          categories: { elemMatch: { code: { eq: productFamily.code } } }
        }
      },
      type: "Product"
    });
  });

  it("returns related products ordered by base scoring weight", async () => {
    const productFamily = createCategory({ categoryType: "ProductFamily" });
    const source: FirestoreProduct = createProduct({
      categories: [productFamily]
    });
    const relatedProduct1 = createProduct({
      name: "product 1",
      baseScoringWeight: 20
    });
    const relatedProduct2 = createProduct({
      name: "product 2",
      baseScoringWeight: 10
    });
    const relatedProduct3 = createProduct({
      name: "product 3",
      baseScoringWeight: 100
    });
    const relatedProducts: FirestoreProduct[] = [
      relatedProduct1,
      relatedProduct2,
      relatedProduct3
    ];

    findAll.mockReturnValue({ entries: relatedProducts });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([
      relatedProduct3,
      relatedProduct1,
      relatedProduct2
    ]);
    expect(findAll).toHaveBeenCalledWith({
      query: {
        filter: {
          categories: { elemMatch: { code: { eq: productFamily.code } } }
        }
      },
      type: "Product"
    });
  });

  it("returns related products ordered by product name when base scoring weight is equal", async () => {
    const productFamily = createCategory({ categoryType: "ProductFamily" });
    const source: FirestoreProduct = createProduct({
      categories: [productFamily]
    });
    const relatedProduct1 = createProduct({
      name: "product 3",
      baseScoringWeight: 10
    });
    const relatedProduct2 = createProduct({
      name: "product 2",
      baseScoringWeight: 10
    });
    const relatedProduct3 = createProduct({
      name: "product 1",
      baseScoringWeight: 10
    });
    const relatedProducts: FirestoreProduct[] = [
      relatedProduct1,
      relatedProduct2,
      relatedProduct3
    ];

    findAll.mockReturnValueOnce({ entries: relatedProducts });

    const returnedRelatedProducts = await Product.relatedProducts.resolve(
      source,
      null,
      context
    );

    expect(returnedRelatedProducts).toEqual([
      relatedProduct3,
      relatedProduct2,
      relatedProduct1
    ]);
    expect(findAll).toHaveBeenCalledWith({
      query: {
        filter: {
          categories: { elemMatch: { code: { eq: productFamily.code } } }
        }
      },
      type: "Product"
    });
  });
});

const sourceNode: Node = {
  id: "source",
  internal: null,
  children: null,
  parent: null,
  hashedCode: "00000001",
  name: "test product",
  colour: "colour",
  textureFamily: "textureFamily",
  path: "simple-path",
  categories: [createCategory({ categoryType: "ProductFamily" })]
};

describe("breadcrumbs resolver", () => {
  it("should use MARKET_TAG_NAME if provided to filter product family", async () => {
    findAll.mockReturnValueOnce({ entries: [] });
    process.env.MARKET_TAG_NAME = "market__test";

    const breadcrumbs = await Product.breadcrumbs.resolve(
      sourceNode,
      null,
      context
    );

    expect(breadcrumbs).toEqual([
      {
        id: "00000001",
        label: "test product",
        slug: "test-product/colour/texturefamily/00000001"
      }
    ]);

    expect(findAll).toBeCalledWith({
      query: {
        filter: {
          categoryCodes: { in: ["code"] },
          metadata: {
            tags: { elemMatch: { contentful_id: { eq: "market__test" } } }
          }
        }
      },
      type: "ContentfulProductListerPage"
    });

    process.env.MARKET_TAG_NAME = "";
  });
});

describe("path resolver", () => {
  it("should return simple path if feature flag provided", async () => {
    process.env.GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE = "true";

    const path = await Product.path.resolve(sourceNode, null, context);

    expect(path).toBe("simple-path");
    process.env.GATSBY_USE_SIMPLE_PDP_URL_STRUCTURE = "";
  });
  it("should return path based on product family", async () => {
    findAll.mockReturnValueOnce({ entries: ["some-parent-family"] });

    const path = await Product.path.resolve(sourceNode, null, context);

    expect(path).toBe(
      "p/product-family-slug/test-product/colour/texturefamily/00000001/"
    );
  });
});

describe("oldPath resolver", () => {
  it("should return oldPath based on product family", async () => {
    findAll.mockReturnValueOnce({ entries: ["some-parent-family"] });

    const path = await Product.oldPath.resolve(sourceNode, null, context);

    expect(path).toBe(
      "p/product-family-slug/test-product/colour/texturefamily/00000001/"
    );
  });
});

describe("video resolver", () => {
  it("should return video data from product", async () => {
    const source: FirestoreProduct = createProduct();

    const result = await Product.videos.resolve(source, null, context);

    expect(result).toEqual([
      {
        __typename: "PimVideo",
        defaultYouTubePreviewImage:
          "https://i.ytimg.com/vi/3901c0ds7oo/maxresdefault.jpg",
        label: "name",
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        videoUrl: "https://www.youtube.com/watch?v=3901c0ds7oo"
      }
    ]);
  });
});
