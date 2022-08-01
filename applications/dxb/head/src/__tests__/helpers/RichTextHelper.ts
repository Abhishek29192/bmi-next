import { RichTextData } from "../../components/RichText";

const createRichText = (richText?: Partial<RichTextData>): RichTextData => ({
  raw: "rich-text-raw",
  references: [
    {
      __typename: "paragraph",
      contentful_id: "rich-text-reference-contentful-id"
    }
  ],
  ...richText
});

export default createRichText;
