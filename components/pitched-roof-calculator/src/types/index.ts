export type RangeValue = {
  start: number;
  end: number;
  value: number;
};

export type BaseProduct = {
  code: string;
  name: string;
  externalProductCode: string;
  image: string;
};

export type LengthBasedProduct = BaseProduct & {
  length: number;
};

export type WidthBasedProduct = BaseProduct & {
  width: number;
};

export type VergeMetalFlushOption = {
  type: "METAL_FLUSH";
  name: string;
  left: LengthBasedProduct;
  right: LengthBasedProduct;
  leftStart: LengthBasedProduct;
  rightStart: LengthBasedProduct;
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
