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
