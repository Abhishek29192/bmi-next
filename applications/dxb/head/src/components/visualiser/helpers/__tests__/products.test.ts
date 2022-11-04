import { createProduct } from "@bmi/elasticsearch-types";
import {
  prepareProducts,
  convertAttrToNumber,
  getVisualiserAssetUrlByType
} from "../products";

describe("products", () => {
  it("returns empty array", () => {
    const res = prepareProducts([]);
    expect(res).toStrictEqual([]);
  });

  it("sets snowFenceActive/isLargeTile/invert/invertY = false by default ", () => {
    const product = createProduct({
      "APPEARANCEATTRIBUTES.COLOUR": [{ name: "black" }],
      "GENERALINFORMATION.CLASSIFICATION": [{ name: "clay" }],
      "TILESATTRIBUTES.VERTICALOVERLAP": [{ name: "10" }],
      "TILESATTRIBUTES.HORIZONTALOVERLAP": [{ name: "10" }],
      "TILESATTRIBUTES.HORIZONTALOFFSET": [{ name: "10" }],
      "TILESATTRIBUTES.THICKNESSREDUCTION": [{ name: "10" }],
      name: "Black tile",
      code: "black_tile",
      visualiserAssets: []
    });

    const preparedProduct = prepareProducts([product])[0];
    expect(preparedProduct.invertY).toBe(false);
    expect(preparedProduct.invert).toBe(false);
    expect(preparedProduct.isLargeTile).toBe(false);
    expect(preparedProduct.snowFenceActive).toBe(false);
  });

  it("returns correctly mapped product", () => {
    const initialProduct = createProduct({
      "APPEARANCEATTRIBUTES.COLOUR": [{ name: "black" }],
      "GENERALINFORMATION.CLASSIFICATION": [{ name: "Clay" }],
      "TILESATTRIBUTES.VERTICALOVERLAP": [{ name: "10" }],
      "TILESATTRIBUTES.HORIZONTALOVERLAP": [{ name: "10" }],
      "TILESATTRIBUTES.HORIZONTALOFFSET": [{ name: "10" }],
      "TILESATTRIBUTES.THICKNESSREDUCTION": [{ name: "10" }],
      "TILESATTRIBUTES.SNOWFENCEACTIVE": [{ name: "true" }],
      "TILESATTRIBUTES.LARGETILE": [{ name: "true" }],
      "TILESATTRIBUTES.INVERT": [{ name: "true" }],
      "TILESATTRIBUTES.INVERTY": [{ name: "true" }],
      name: "Black tile",
      code: "black_tile",
      visualiserAssets: []
    });

    const preparedProduct = prepareProducts([initialProduct])[0];
    expect(preparedProduct.code).toBe(initialProduct.code);
    expect(preparedProduct.name).toBe(initialProduct.name);
    expect(preparedProduct.category).toBe("clay");
    expect(preparedProduct.verticalOverlap).toBe(10);
    expect(preparedProduct.horizontalOverlap).toBe(10);
    expect(preparedProduct.horizontalOffset).toBe(10);
    expect(preparedProduct.thicknessReduction).toBe(10);
    expect(preparedProduct.invertY).toBe(true);
    expect(preparedProduct.invert).toBe(true);
    expect(preparedProduct.isLargeTile).toBe(true);
    expect(preparedProduct.snowFenceActive).toBe(true);
  });
});

describe("convertAttrToNumber", () => {
  it("returns correct number", () => {
    const res = convertAttrToNumber({ code: "", name: "89.7" });
    expect(res).toBe(89.7);
  });

  it("returns 0", () => {
    const res = convertAttrToNumber({ code: "", name: "89 .,. 7" });
    expect(res).toBe(0);
  });
});

describe("getVisualiserAssetUrlByType", () => {
  const product = createProduct({
    "APPEARANCEATTRIBUTES.COLOUR": [{ name: "black" }],
    "GENERALINFORMATION.CLASSIFICATION": [{ name: "clay" }],
    "TILESATTRIBUTES.VERTICALOVERLAP": [{ name: "10" }],
    "TILESATTRIBUTES.HORIZONTALOVERLAP": [{ name: "10" }],
    "TILESATTRIBUTES.HORIZONTALOFFSET": [{ name: "10" }],
    "TILESATTRIBUTES.THICKNESSREDUCTION": [{ name: "10" }],
    name: "Black tile",
    code: "black_tile",
    visualiserAssets: [
      {
        allowedToDownload: true,
        assetType: "NORMAL_MAP_REFERENCE",
        fileSize: 1,
        name: "Asset name",
        realFileName: "asset-name.glb",
        url: "https://mock_url.glb"
      }
    ]
  });

  it("returns assets correctly", () => {
    const res = getVisualiserAssetUrlByType(product)("NORMAL_MAP_REFERENCE");
    expect(res).toBe("https://mock_url.glb");
  });

  it("returns empty string if needed asset doesn't exist", () => {
    const res = getVisualiserAssetUrlByType(product)("RIDGE_REFERENCE");
    expect(res).toBe("");
  });
});
