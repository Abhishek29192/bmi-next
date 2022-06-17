import { Product, System } from "@bmi/pim-types";

export type MessageType = "UPDATED" | "DELETED";
export type ItemType = "PRODUCTS" | "SYSTEMS";

export const enum ObjType {
  System = "system",
  Base_product = "base_product",
  Variant = "variant",
  Layer = "layer"
}

export type DeleteItemType = {
  code: string;
  objType: ObjType;
};
export type Message =
  | {
      type: "UPDATED";
      itemType: "PRODUCTS";
      items: Product[];
    }
  | {
      type: "UPDATED";
      itemType: "SYSTEMS";
      items: System[];
    }
  | {
      type: "DELETED";
      itemType: ItemType;
      items: DeleteItemType[];
    };
