import { BLOCKS } from "@contentful/rich-text-types";
import creatContentfulParentPage from "./ContentfulParentPageHelper";
import type { ContentfulRichText } from "../RichText";
import type {
  AssetData as RichTextAsset,
  InlinePage as RichTextInfoPage,
  RichTextTable
} from "../../ContentfulRichText";

const createContentfulRichText = (
  richTextData?: Partial<ContentfulRichText>
): ContentfulRichText => ({
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: "text",
            value: "Hello",
            marks: [{ type: "bold" }],
            data: {}
          },
          {
            nodeType: "text",
            value: " world!",
            marks: [{ type: "italic" }],
            data: {}
          }
        ]
      }
    ]
  },
  ...richTextData
});

export const createRichTextAsset = (
  asset?: Partial<RichTextAsset>
): RichTextAsset => ({
  __typename: "Asset",
  sys: {
    id: "rich-text-asset-id"
  },
  title: "Title",
  contentType: "image/webp",
  url: "some-utl",
  ...asset
});

export const createRichTextInlinePageEntry = (
  pageData?: Partial<RichTextInfoPage>
): RichTextInfoPage => ({
  __typename: "Page",
  title: "Entry",
  slug: "entry-slug",
  sys: {
    id: "rich-text-entry-id"
  },
  parentPage: creatContentfulParentPage(),
  ...pageData
});

export const createRichTextTableEntry = (
  tableData?: Partial<RichTextTable>
): RichTextTable => ({
  __typename: "Table",
  data: {
    tableData: []
  },
  sys: {
    id: "rich-text-entry-id"
  },
  ...tableData
});

export default createContentfulRichText;
