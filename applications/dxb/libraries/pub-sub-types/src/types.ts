import { Product, System } from "@bmi/pim-types";

export const enum ObjType {
  System = "system",
  Base_product = "base_product",
  Variant = "variant",
  Layer = "layer"
}

export type PimDeltaMessage = {
  catalog: string;
  token: string;
  timestamp: number;
  type: MessageType;
  baseSite: string;
  endpointUrl: string;
  itemType: ItemType;
  base?: string[];
  variant?: string[];
  system?: string[];
  layer?: string[];
};

export type MessageType = "UPDATED" | "DELETED";

export type ItemType = "CATEGORIES" | "PRODUCTS" | "SYSTEMS";

export type DeleteItem = DeleteProductItem | DeleteSystemItem;

export type DeleteProductItem = {
  code: string;
  objType: ObjType.Base_product | ObjType.Variant;
};

export type DeleteSystemItem = {
  code: string;
  objType: ObjType.System | ObjType.Layer;
};

export type UpdateProductMessage = {
  type: "UPDATED";
  itemType: "PRODUCTS";
  item: Product;
};

export type UpdateSystemMessage = {
  type: "UPDATED";
  itemType: "SYSTEMS";
  item: System;
};

export type UpdateCategoryMessage = {
  type: "UPDATED";
  itemType: "CATEGORIES";
  item: unknown;
};

export type DeleteProductMessage = {
  type: "DELETED";
  itemType: "PRODUCTS";
  item: DeleteProductItem;
};

export type DeleteSystemMessage = {
  type: "DELETED";
  itemType: "SYSTEMS";
  item: DeleteSystemItem;
};

export type Message =
  | UpdateProductMessage
  | UpdateSystemMessage
  | UpdateCategoryMessage
  | DeleteProductMessage
  | DeleteSystemMessage;
