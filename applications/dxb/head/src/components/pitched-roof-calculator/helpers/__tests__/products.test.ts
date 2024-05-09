import { ProductReference } from "@bmi/elasticsearch-types";
import { createProduct } from "../../__tests__/helpers/createProduct";
import {
  mainTileReferencesMapper,
  ProductCategory,
  ProductType,
  ReferencedTileProducts,
  WidthBasedProduct
} from "../../types";
import {
  getVergeOption,
  prepareProducts,
  transformProductReferences
} from "../products";

describe("prepareProducts", () => {
  const tileClassificationAttributes = {
    APPEARANCEATTRIBUTES$COLOUR: [{ code: "black", name: "black" }],
    MEASUREMENTS$LENGTH: [{ value: "30", code: "30cm" }],
    TILESATTRIBUTES$MINIMUMBATTENSPACING: [{ value: "10", code: "30cm" }],
    TILESATTRIBUTES$RIDGESPACE: [{ value: "30", code: "30cm" }],
    TILESATTRIBUTES$AVERAGEDECKWIDTH: [{ value: "300", code: "300mm" }],
    TILESATTRIBUTES$AVERAGEDECKLENGTH: [{ value: "270", code: "270mm" }],
    GENERALINFORMATION$PRODUCTTYPE: [{ code: ProductType.tile }]
  };

  describe("Tile attributes", () => {
    it("returns correct attributes for tiles", () => {
      const product = createProduct({
        ...tileClassificationAttributes,
        TILESATTRIBUTES$BROKENBOND: [{ name: "true" }],
        baseProduct: {
          code: "base_product_code",
          name: "base product"
        }
      });

      const tile = prepareProducts([product]).tiles.base_product_code[0];
      expect(tile.color).toBe("black");
      expect(tile.coverWidth).toBe(30);
      expect(tile.length).toBe(30);
      expect(tile.minBattenSpacing).toBe(10);
      expect(tile.ridgeSpacing).toBe(30);
      expect(tile.brokenBond).toBe(true);
    });

    it("assign brokenBond value by default", () => {
      const product = createProduct({
        ...tileClassificationAttributes,
        baseProduct: {
          code: "base_product_code",
          name: "base product"
        }
      });

      const tile = prepareProducts([product]).tiles.base_product_code[0];
      expect(tile.brokenBond).toBe(false);
    });

    it("ignores product if measurements are wrong", () => {
      const product = createProduct({
        ...tileClassificationAttributes,
        TILESATTRIBUTES$AVERAGEDECKWIDTH: [{ value: "mock", code: "mock" }],
        baseProduct: {
          code: "base_product_code",
          name: "base product"
        }
      });

      const products = prepareProducts([product]);
      expect(products.tiles).toStrictEqual({});
    });

    it("returns 'packSize' field", () => {
      const product = createProduct({
        ...tileClassificationAttributes,
        PACKAGINGINFORMATION$QUANTITYPERUNIT: [
          { value: "20", code: "20", name: 20 }
        ],
        baseProduct: {
          code: "base_product_code",
          name: "base product"
        }
      });

      const products = prepareProducts([product]);
      const tile = products.tiles.base_product_code[0];
      expect(tile.packSize).toBe(20);
    });

    it("returns correct data if there are no product references", () => {
      const product = createProduct({
        ...tileClassificationAttributes,
        baseProduct: {
          code: "zanda_classic",
          name: "base product"
        },
        productReferences: undefined
      });

      const products = prepareProducts([product]);
      const tile = products.tiles.zanda_classic[0];
      expect(tile.productReferences).toStrictEqual([]);
    });
  });

  describe("Underlay attributes", () => {
    it("returns correct attributes for underlay", () => {
      const product = createProduct({
        MEASUREMENTS$LENGTH: [{ value: "1500", code: "1500cm" }],
        MEASUREMENTS$WIDTH: [{ value: "300", code: "300cm" }],
        UNDERLAYATTRIBUTES$OVERLAP: [{ value: "10", code: "10cm" }],
        GENERALINFORMATION$PRODUCTTYPE: [{ code: ProductType.underlay }]
      });

      const underlay = prepareProducts([product]).underlays[0];
      expect(underlay.width).toBe(300);
      expect(underlay.length).toBe(1500);
      expect(underlay.overlap).toBe(10);
    });
  });

  describe("Gutter and GutterHook related attributes", () => {
    it("returns correct attributes for gutter", () => {
      const product = createProduct({
        MEASUREMENTS$LENGTH: [{ value: "1500", code: "1500cm" }],
        GENERALINFORMATION$PRODUCTTYPE: [{ code: ProductType.gutter }],
        baseProduct: {
          code: "base_product_code",
          name: "base product"
        }
      });

      const gutter = prepareProducts([product]).gutters["base_product_code"][0];
      expect(gutter.length).toBe(1500);
    });

    it("returns correct attributes for gutterHooks", () => {
      const product = createProduct({
        MEASUREMENTS$LENGTH: [{ value: "1500", code: "1500cm" }],
        GENERALINFORMATION$PRODUCTTYPE: [{ code: ProductType.gutterHook }]
      });

      const gutterHook = prepareProducts([product]).gutterHooks[0];
      expect(gutterHook.length).toBe(1500);
    });
  });
});

describe("transformProductReferences", () => {
  const productReferences: ProductReference[] = [
    { code: "hip_product", type: "HIP" },
    { code: "accessory", type: "ACCESSORIES" },
    { code: "half_tile", type: "HALF_TILE" }
  ];

  const hip = createProduct({
    code: "hip_product",
    TILESATTRIBUTES$AVERAGEDECKLENGTH: [{ value: "35", code: "35cm" }]
  });
  const firstAccessory = createProduct({
    code: "accessory",
    GENERALINFORMATION$CLASSIFICATION: [
      { code: ProductCategory.Accessories, name: ProductCategory.Accessories }
    ]
  });

  const halfTile = createProduct({
    code: "half_tile",
    TILESATTRIBUTES$AVERAGEDECKWIDTH: [{ value: "30", code: "30cm" }]
  });

  it("groups product references correctly", () => {
    const res = transformProductReferences<ReferencedTileProducts>(
      productReferences,
      [hip, firstAccessory, halfTile],
      mainTileReferencesMapper
    );

    expect(res.hip!.code).toBe(hip.code);
    expect(res.halfTile!.code).toBe(halfTile.code);
    expect(res.accessories!.length).toBe(1);
  });

  it("returns null if length based product doesn't have 'coverLength' field", () => {
    const product = {
      ...hip,
      TILESATTRIBUTES$AVERAGEDECKLENGTH: undefined
    };
    const res = transformProductReferences<ReferencedTileProducts>(
      productReferences,
      [product],
      mainTileReferencesMapper
    );

    expect(res.hip).toBe(undefined);
  });

  it("returns null if width based product doesn't have 'coverWidth' field", () => {
    const product = {
      ...halfTile,
      TILESATTRIBUTES$AVERAGEDECKWIDTH: undefined
    };
    const res = transformProductReferences<ReferencedTileProducts>(
      productReferences,
      [product],
      mainTileReferencesMapper
    );

    expect(res.halfTile).toBe(undefined);
  });
});

describe("getVergeOption", () => {
  const leftVerge = createProduct<WidthBasedProduct>({
    name: "left verge",
    coverWidth: 10
  });
  const rightVerge = createProduct<WidthBasedProduct>({
    name: "right verge",
    coverWidth: 10
  });

  it("returns undefined", () => {
    const verge = getVergeOption({ right: undefined, left: undefined });
    expect(verge).toBe(undefined);
  });

  it("returns verge tile", () => {
    const verge = getVergeOption({
      left: leftVerge,
      right: rightVerge
    });
    expect(verge).toStrictEqual({
      left: leftVerge,
      right: rightVerge,
      halfLeft: undefined,
      halfRight: undefined
    });
  });
});
