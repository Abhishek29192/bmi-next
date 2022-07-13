import { Message } from "@bmi/pub-sub-types";

// This type is speculative at best
export type MessageFunction = (
  data: { data: string } | { data: Message },
  context: {
    message: {
      data: Message;
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
