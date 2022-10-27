import { Product as ESProduct } from "@bmi/elasticsearch-types";
import { PIMTile } from "../Types";
import { convertStrToBool } from "../../../utils/convertStrToBool";

export const prepareProducts = (products: ESProduct[]): PIMTile[] => {
  if (!products.length) {
    return [];
  }

  return products.map(convertEsValues);
};

export const convertEsValues = (product: ESProduct): PIMTile => {
  const {
    "APPEARANCEATTRIBUTES.COLOUR": colour,
    "GENERALINFORMATION.CLASSIFICATION": category,
    "TILESATTRIBUTES.VERTICALOVERLAP": verticalOverlap,
    "TILESATTRIBUTES.HORIZONTALOVERLAP": horizontalOverlap,
    "TILESATTRIBUTES.HORIZONTALOFFSET": horizontalOffset,
    "TILESATTRIBUTES.SNOWFENCEACTIVE": snowFenceActive,
    "TILESATTRIBUTES.LARGETILE": isLargeTile,
    "TILESATTRIBUTES.THICKNESSREDUCTION": thicknessReduction,
    "TILESATTRIBUTES.INVERT": invert,
    "TILESATTRIBUTES.INVERTY": invertY
  } = product;

  const getAssetUrl = getVisualiserAssetUrlByType(product);

  return {
    name: product.name,
    code: product.code,
    path: product.path,
    colour: colour[0].name,
    category: category[0].name.toLowerCase(),
    verticalOverlap: convertAttrToNumber(verticalOverlap[0]),
    horizontalOverlap: convertAttrToNumber(horizontalOverlap[0]),
    horizontalOffset: convertAttrToNumber(horizontalOffset[0]),
    snowFenceActive: convertStrToBool(snowFenceActive?.[0].name),
    isLargeTile: convertStrToBool(isLargeTile?.[0].name),
    thicknessReduction: convertAttrToNumber(thicknessReduction[0]),
    invert: convertStrToBool(invert?.[0].name),
    invertY: convertStrToBool(invertY?.[0].name),
    normalMapRef: getAssetUrl("NORMAL_MAP_REFERENCE"),
    highDetailMeshRef: getAssetUrl("HIGH_DETAIL_MESH_REFERENCE"),
    lowDetailMeshRef: getAssetUrl("LOW_DETAIL_MESH_REFERENCE"),
    ridgeRef: getAssetUrl("RIDGE_REFERENCE"),
    ridgeEndRef: getAssetUrl("RIDGE_END_REFERENCE"),
    metallicRoughnessMapRef: getAssetUrl("METALLIC_ROUGHNESS_MAP_REFERENCE"),
    diffuseMapRef: getAssetUrl("DIFFUSE_MAP_REFERENCE"),
    mainImage: product.mainImage
  };
};

export const convertAttrToNumber = (attr: { code: string; name: string }) => {
  return Number(attr.name) || 0;
};

export const getVisualiserAssetUrlByType = (product: ESProduct) => {
  return function (type: string): string {
    return (
      product.visualiserAssets.find((asset) => asset.assetType === type)?.url ||
      ""
    );
  };
};
