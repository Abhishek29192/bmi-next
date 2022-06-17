import {
  createCategory,
  createProduct,
  Product as FirestoreProduct,
  createProductDocument
} from "@bmi/firestore-types";
import { Context } from "../types/Gatsby";
import Product from "../Product";

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
          query: {},
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
          query: {},
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
          query: {},
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

    findAll.mockReturnValue({ entries: relatedProducts });

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
