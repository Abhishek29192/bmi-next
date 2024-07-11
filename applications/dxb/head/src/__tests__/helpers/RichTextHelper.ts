import { BLOCKS } from "@contentful/rich-text-types";
import type { RichTextData } from "../../components/RichText";

const createRichText = (richText?: Partial<RichTextData>): RichTextData => ({
  json: {
    data: {},
    content: [
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value: "rich-text-raw",
            nodeType: "text"
          }
        ],
        nodeType: BLOCKS.PARAGRAPH
      }
    ],
    nodeType: BLOCKS.DOCUMENT
  },
  references: new Map(),
  ...richText
});

export default createRichText;
