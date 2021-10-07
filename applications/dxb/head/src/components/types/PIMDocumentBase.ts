import { Data as AssetTypeData } from "../AssetType";
import { Product } from "./pim";

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

export type PIMLinkDocumentData = PIMDocumentBase & {
  __typename: "PIMLinkDocument";
};

export type PIMDocumentData = PIMDocumentBase & {
  __typename: "PIMDocument";
  fileSize: number;
  format: string;
  extension: string;
  realFileName: string;
};
