import { Message } from "@bmi/pub-sub-types";

// This type is speculative at best
export type MessageFunction = (
  data: { data: string } | { data: Message },
  context: {
    message: {
      data: Message;
    };
  }
) => Promise<void>;

export type ProductDocumentNameMap =
  | "Product name + asset type"
  | "Document name";

export type ContentfulAssetType = {
  code: string;
  name: string;
  pimCode: string;
};
