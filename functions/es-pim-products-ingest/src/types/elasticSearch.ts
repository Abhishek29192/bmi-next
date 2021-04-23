import type { Product, Image } from "./pim";

export type Operation = "index" | "delete" | "create" | "update";

export type BulkOperationInstruction = any; // TODO

type Category = {
  code: string;
  parentCategoryCode: string;
};

export type ProductVariant = {
  code: string;
  baseProduct: Product;
  brandCode: string; // ???
  images: readonly Image[];
  categories: readonly Category[];
  // classifications: readonly Classification[];
  classifications: any;
};
