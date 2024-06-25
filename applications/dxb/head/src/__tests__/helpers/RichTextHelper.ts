import { RichTextData } from "../../components/RichText";

const createRichText = (richText?: Partial<RichTextData>): RichTextData => ({
  raw: JSON.stringify({
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
        nodeType: "paragraph"
      }
    ],
    nodeType: "document"
  }),
  references: [
    {
      __typename: "paragraph",
      contentful_id: "rich-text-reference-contentful-id"
    }
  ],
  ...richText
});

export default createRichText;
