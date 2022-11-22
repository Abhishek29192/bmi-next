import { Product as ESProduct } from "@bmi/elasticsearch-types";
import {
  ProductCategory,
  ResultsObject as BasicResults,
  ResultsRow
} from "../index";

interface BaseProduct extends ESProduct {
  externalProductCode: string;
  packSize: number;
}

export interface Accessory extends BaseProduct {
  category: ProductCategory;
}

export interface LengthBasedProduct extends BaseProduct {
  length: number;
}

export interface WidthBasedProduct extends BaseProduct {
  width: number;
}

export interface RidgeOption extends LengthBasedProduct {
  tRidge?: LengthBasedProduct;
  yRidge?: LengthBasedProduct;
  ridgeEnd?: LengthBasedProduct;
}

export type VentilationHood = ESProduct;

export interface VergeVariant extends BaseProduct {
  length?: number;
  width?: number;
}
export interface VergeOption {
  left: VergeVariant;
  right: VergeVariant;
  leftStart?: VergeVariant;
  rightStart?: VergeVariant;
  halfLeft?: VergeVariant;
  halfRight?: VergeVariant;
}

export interface ReferencedTileProducts extends VergeOption {
  ridgeOptions?: RidgeOption[];
  ventilationHoodOptions?: VentilationHood[];
  accessories?: Accessory[];
  eaveAccessories?: Accessory[];
  hip?: LengthBasedProduct;
  halfTile?: WidthBasedProduct;
  valleyMetalFlushStart?: LengthBasedProduct;
  valleyMetalFlush?: LengthBasedProduct;
  valleyMetalFlushEnd?: LengthBasedProduct;
  valleyMetalFlushTop?: LengthBasedProduct;
  valleyMetalFlushDormerStart?: LengthBasedProduct;
  clip?: Accessory;
  ridgeAndHipScrew?: Accessory;
  longScrew?: Accessory;
  screw?: Accessory;
  stormBracket?: Accessory;
  finishingKit?: Accessory;
}

export interface NestedProductReferences {
  tRidge?: LengthBasedProduct;
  yRidge?: LengthBasedProduct;
  ridgeEnd?: LengthBasedProduct;
  downPipe?: Accessory;
  downPipeConnector?: Accessory;
}

export interface Tile
  extends BaseProduct,
    Omit<ReferencedTileProducts, keyof VergeOption> {
  color: string;
  category: string;
  brokenBond: boolean;
  maxBattenSpacing: number;
  eaveGauge: number;
  ridgeSpacing: number;
  minBattenSpacing: number;
  width: number;
  length: number;
  vergeOption?: VergeOption;
}

export type GroupedTiles = { [baseProductCode: string]: Tile[] };

export type GroupedGutters = {
  [baseProductCode: string]: GutterVariant[];
};

export interface ResultsObject extends BasicResults {
  extras: ResultsRow[] | null;
}

export interface Underlay extends BaseProduct {
  overlap: number;
  length: number;
  width: number;
}

export type GutterHook = LengthBasedProduct;

export interface GutterVariant extends BaseProduct {
  length: number;
  downPipe?: Accessory;
  downPipeConnector?: Accessory;
}

export enum ProductType {
  tile = "MAIN_TILE",
  underlay = "UNDERLAY",
  gutter = "GUTTER",
  gutterHook = "GUTTER_HOOK"
}

export interface Data {
  tiles: GroupedTiles;
  underlays: Underlay[];
  gutters: GroupedGutters;
  gutterHooks: GutterHook[];
}

export interface TileOptionSelections {
  ridge?: RidgeOption;
  verge?: VergeOption | "none";
  ventilationHoods: VentilationHood[] | "none";
}

export type GutteringFormSelection = {
  guttering?: string;
  gutteringVariant?: string;
  gutteringHook?: string;
  downPipes?: number;
  downPipeConnectors?: number;
};

export const lengthBasedProducts = [
  "HIP",
  "RIDGE_TILE",
  "LEFT_START",
  "RIGHT_START",
  "VALLEY_METAL_FLUSH_START",
  "VALLEY_METAL_FLUSH",
  "VALLEY_METAL_FLUSH_END",
  "VALLEY_METAL_FLUSH_TOP",
  "VALLEY_METAL_FLUSH_DORMER_START"
];

export const widthBasedProducts = [
  "HALF_TILE",
  "LEFT_VERGE_TILE",
  "LEFT_VERGE_HALF_TILE",
  "RIGHT_VERGE_TILE",
  "RIGHT_VERGE_HALF_TILE"
];

export const multiValueProducts = [
  "EAVE_ACCESSORIES",
  "VENTILATION_HOOD",
  "ACCESSORIES",
  "RIDGE_TILE"
];

export const mainTileReferencesMapper = {
  HIP: "hip",
  HALF_TILE: "halfTile",
  RIDGE_TILE: "ridgeOptions",
  VALLEY_METAL_FLUSH_START: "valleyMetalFlushStart",
  VALLEY_METAL_FLUSH: "valleyMetalFlush",
  VALLEY_METAL_FLUSH_END: "valleyMetalFlushEnd",
  VALLEY_METAL_FLUSH_TOP: "valleyMetalFlushTop",
  VALLEY_METAL_FLUSH_DORMER_START: "valleyMetalFlushDormerStart",
  EAVE_ACCESSORIES: "eaveAccessories",
  ACCESSORIES: "accessories",
  VENTILATION_HOOD: "ventilationHoodOptions",
  CLIP: "clip",
  RIDGE_AND_HIP_SCREW: "ridgeAndHipScrew",
  LONG_SCREW: "longScrew",
  SCREW: "screw",
  STORM_BRACKET: "stormBracket",
  FINISHING_KIT: "finishingKit",
  LEFT_VERGE_TILE: "left",
  RIGHT_VERGE_TILE: "right",
  LEFT_START: "leftStart",
  RIGHT_START: "rightStart",
  LEFT_VERGE_HALF_TILE: "halfLeft",
  RIGHT_VERGE_HALF_TILE: "halfRight"
};

export const nestedProductReferencesMapper: Record<
  string,
  keyof NestedProductReferences
> = {
  RIDGE_END_TILE: "ridgeEnd",
  T_RIDGE: "tRidge",
  Y_RIDGE: "yRidge",
  DOWN_PIPE: "downPipe",
  DOWN_PIPE_CONNECTOR: "downPipeConnector"
};
