import { EntryFields } from "contentful";
import { BLOCKS } from "@contentful/rich-text-types";

const createRichText = (
  richText?: Partial<EntryFields.RichText>
): EntryFields.RichText => ({
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "Integer imperdiet venenatis elementum. Donec id ligula non massa rutrum convallis tincidunt at felis. Nulla eget purus id elit dignissim fringilla. Nunc egestas massa nec maximus commodo.",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ],
  nodeType: BLOCKS.DOCUMENT,
  ...richText
});

export default createRichText;
