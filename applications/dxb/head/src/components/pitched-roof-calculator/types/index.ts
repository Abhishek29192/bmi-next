import { BattenSpacing, Product as ESProduct } from "@bmi/elasticsearch-types";
import { Data as TitleWithContentProps } from "../../TitleWithContent";

export type RangeValue = {
  start: number;
  end: number;
  value: number;
};

export interface BaseProduct extends ESProduct {
  externalProductCode: string;
  packSize: number;
  coverLength: number | undefined;
  coverWidth: number | undefined;
}

export type BaseVariant = BaseProduct & {
  externalProductCode: string;
  image: string;
};

export interface Accessory extends BaseProduct {
  category: ProductCategory;
}

export interface LengthBasedProduct extends BaseProduct {
  coverLength: number;
  category: ProductCategory | undefined;
}

export interface WidthBasedProduct extends BaseProduct {
  coverWidth: number;
  category: ProductCategory | undefined;
}

export interface RidgeOption extends LengthBasedProduct {
  tRidge?: LengthBasedProduct;
  yRidge?: LengthBasedProduct;
  ridgeEnd?: LengthBasedProduct;
}

export type VentilationHood = ESProduct;

export interface VergeOption {
  left: WidthBasedProduct;
  right: WidthBasedProduct;
  halfLeft?: WidthBasedProduct;
  halfRight?: WidthBasedProduct;
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
  brokenBond: boolean;
  battenSpacings: BattenSpacing[];
  ridgeSpacing: number;
  minBattenSpacing: number;
  coverWidth: number;
  length: number;
  vergeOption?: VergeOption;
}

export type GroupedTiles = { [baseProductCode: string]: Tile[] };

export type GroupedGutters = {
  [baseProductCode: string]: GutterVariant[];
};

export type BasicResults = {
  [category in ProductCategory]: ResultsRow[];
};

export interface ResultsObject extends BasicResults {
  extras: ResultsRow[] | null;
}

export interface Underlay extends BaseProduct {
  overlap: number;
  length: number;
  width: number;
}

export type GutterHook = BaseProduct & { length: number };

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

export type MainTileCategory = "concrete" | "metal" | "clay";

export const lengthBasedProducts = [
  "HIP",
  "RIDGE_TILE",
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

export enum ProductCategory {
  Tiles = "tiles",
  Sealing = "sealing",
  Fixings = "fixings",
  Ventilation = "ventilation",
  Accessories = "accessories"
}

export type ResultsRow = {
  category: ProductCategory;
  image?: string;
  description: string;
  externalProductCode: string;
  packSize: string;
  quantity: number;
};

export enum CalculatorSteps {
  SelectRoof = "select-roof",
  EnterDimensions = "enter-dimensions",
  SelectTileCategory = "select-tile-category",
  SelectTile = "select-tile",
  SelectVariant = "select-variant",
  TileOptions = "tile-options",
  SelectUnderlay = "select-underlay",
  Guttering = "guttering",
  YourSolutionContains = "your-solution-contains"
}

export type CalculatorConfig = {
  hubSpotFormId: string | null;
  roofShapes: { roofShapeId: string }[];
  needHelpSection: TitleWithContentProps;
};
