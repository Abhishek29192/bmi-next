import { EntryFields } from "contentful";

const createRichText = (
  richText?: Partial<EntryFields.RichText>
): EntryFields.RichText => ({
  data: {},
  content: [
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value:
            "Integer imperdiet venenatis elementum. Donec id ligula non massa rutrum convallis tincidunt at felis. Nulla eget purus id elit dignissim fringilla. Nunc egestas massa nec maximus commodo.",
          marks: [],
          data: {}
        }
      ],
      marks: [], // This isn't actually returned at this level, but the type expects it
      data: {}
    }
  ],
  nodeType: "document",
  ...richText
});

export default createRichText;
