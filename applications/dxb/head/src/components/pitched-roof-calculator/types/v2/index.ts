import {
  Data as DataV1,
  LengthBasedProduct,
  MainTile as MainTileV1,
  MainTileVariant as MainTileVariantV1
} from "../index";

export interface RidgeTile extends LengthBasedProduct {
  tRidge?: LengthBasedProduct;
  yRidge?: LengthBasedProduct;
  ridgeEnd?: LengthBasedProduct;
}

export interface MainTileVariant extends MainTileVariantV1 {
  ridgeOptions: RidgeTile[];
}

export interface MainTile extends MainTileV1 {
  variants: MainTileVariant[];
}

export interface Data extends DataV1 {
  mainTiles: MainTile[];
}
