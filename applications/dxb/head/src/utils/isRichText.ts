import { RichTextData } from "../components/RichText";

export const isRichText = (data: unknown): data is RichTextData => {
  if (typeof data !== "object") {
    return false;
  }

  return (
    !!data &&
    "raw" in data &&
    "references" in data &&
    Object.keys(data).length === 2
  );
};
