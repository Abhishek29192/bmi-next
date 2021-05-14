import { Data as AssetTypeData } from "./AssetType";
import { Product } from "./ProductBaseTypes";

export type PIMDocumentProduct = Pick<
  Product,
  "code" | "name" | "categories" | "classifications"
>;

export type PIMDocumentBase = {
  id: string;
  title: string;
  product: PIMDocumentProduct;
  url: string;
  assetType: AssetTypeData;
};
