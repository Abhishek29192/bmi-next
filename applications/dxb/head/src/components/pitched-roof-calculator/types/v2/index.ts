import {
  Data as DataV1,
  LengthBasedProduct,
  MainTile as MainTileV1,
  MainTileVariant as MainTileVariantV1,
  ResultsObject as BasicResults,
  ResultsRow
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

export interface ResultsObject extends BasicResults {
  extras: ResultsRow[] | null;
}
