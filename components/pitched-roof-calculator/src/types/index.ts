export type RangeValue = {
  start: number;
  end: number;
  value: number;
};

export type BaseProduct = {
  code: string;
  name: string;
};

export type BaseVariant = BaseProduct & {
  externalProductCode: string;
  image: string;
};

export type LengthBasedProduct = BaseVariant & {
  length: number;
};

export type WidthBasedProduct = BaseVariant & {
  width: number;
};

export type VergeMetalFlushOption = {
  type: "METAL_FLUSH";
  name: string;
  left: LengthBasedProduct;
  right: LengthBasedProduct;
  leftStart?: LengthBasedProduct;
  rightStart?: LengthBasedProduct;
};

export type VergeTileOption = {
  type: "TILE";
  name: string;
  left: WidthBasedProduct;
  right: WidthBasedProduct;
  halfLeft: WidthBasedProduct;
  halfRight: WidthBasedProduct;
};

export type VergeOption = VergeTileOption | VergeMetalFlushOption;

export type Accessory = BaseVariant & {
  category: ProductCategory;
  packSize?: number;
};

export type Underlay = BaseVariant & {
  minSupportedPitch: number;
  length: number;
  width: number;
  overlap: number;
};

export type GutteringVaraint = LengthBasedProduct & {
  downpipe: Accessory;
  downpipeConnector: Accessory;
};

export type Guttering = BaseProduct & {
  image: string;
  variants: GutteringVaraint[];
};

export type BaseTile = {
  minBattenGauge: number;
  maxBattenGauge: RangeValue[];
  eaveGauge: RangeValue[];
  ridgeSpacing: RangeValue[];
  width: number;
  height: number;
  brokenBond: boolean;
};

export type MainTileVariant = BaseVariant &
  BaseTile & {
    color: string;
    halfTile: WidthBasedProduct;
    hip: LengthBasedProduct;
    ridgeOptions: LengthBasedProduct[];
    vergeOptions: VergeOption[];
    valleyMetalFlushStart: LengthBasedProduct;
    valleyMetalFlush: LengthBasedProduct;
    valleyMetalFlushEnd: LengthBasedProduct;
    valleyMetalFlushTop: LengthBasedProduct;
    valleyMetalFlushDormerStart: LengthBasedProduct;
    accessories: Accessory[];
    eaveAccessories: Accessory[];
    clip: Accessory;
    ridgeAndHipScrew: Accessory;
    longScrew: Accessory;
    screw: Accessory;
    stormBracket: Accessory;
    finishingKit: Accessory;
    ventilationHoodOptions: Accessory[];
  };

export type MainTileCategory = "concrete" | "metal" | "clay";

export type MainTile = BaseProduct &
  BaseTile & {
    category: MainTileCategory;
    variants: MainTileVariant[];
  };

export type ProductCategory =
  | "tiles"
  | "fixings"
  | "sealing"
  | "ventilation"
  | "accessories";

export type ResultsRow = {
  category: ProductCategory;
  image: string;
  description: string;
  externalProductCode: string;
  packSize: string;
  quantity: number;
};

export type ResultsObject = {
  [category in ProductCategory]: ResultsRow[];
};
