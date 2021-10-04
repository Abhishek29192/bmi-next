import { Product as PIMProduct, System } from "./pim";

type Message = {
  type: string;
  itemType: "CATEGORIES" | "PRODUCTS" | "SYSTEMS";
};

export type ProductMessage = {
  itemType: "PRODUCTS";
  items: ReadonlyArray<PIMProduct>;
} & Message;

export type SystemMessage = {
  itemType: "SYSTEMS";
  items: ReadonlyArray<System>;
} & Message;

// This type is speculative at best
export type MessageFunction = (
  event: { data: string } | { data: ProductMessage | SystemMessage },
  context: {
    message: {
      data: ProductMessage | SystemMessage;
    };
  }
) => Promise<any>;

export type DeleteOperation = {
  delete: {
    _index: string;
    _id: string;
  };
};

export type IndexOperation = {
  index: {
    _index: string;
    _id: string;
  };
};
