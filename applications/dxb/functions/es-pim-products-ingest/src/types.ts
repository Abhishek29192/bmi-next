import { DeleteItemType, MessageType } from "@bmi/gcp-pim-message-handler";
import { Product as PIMProduct, System as PIMSystem } from "@bmi/pim-types";

type Message = {
  type: MessageType;
  itemType: "CATEGORIES" | "PRODUCTS" | "SYSTEMS";
};

export type DeleteMessage = {
  items: ReadonlyArray<DeleteItemType>;
} & Message;

export type ProductMessage = {
  itemType: "PRODUCTS";
  items: ReadonlyArray<PIMProduct>;
} & Message;

export type SystemMessage = {
  itemType: "SYSTEMS";
  items: ReadonlyArray<PIMSystem>;
} & Message;

// This type is speculative at best
export type MessageFunction = (
  data:
    | { data: string }
    | { data: ProductMessage | SystemMessage | DeleteMessage },
  context: {
    message: {
      data: ProductMessage | SystemMessage | DeleteMessage;
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
