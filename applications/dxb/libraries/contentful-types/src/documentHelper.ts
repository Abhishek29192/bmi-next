import createAsset, { createFullyPopulatedAsset } from "./assetHelper";
import createAssetType, {
  createFullyPopulatedAssetType
} from "./assetTypeHelper";
import createEntry, { createFullyPopulatedEntry } from "./entryHelper";
import { createFullyPopulatedImage } from "./imageHelper";
import createRichText from "./richTextHelper";
import { Document } from "./types";

export const createFullyPopulatedDocument = (
  contentfulDocument?: Partial<Document>
): Document => ({
  ...createContentfulDocument(),
  asset: createFullyPopulatedAsset(),
  assetType: createFullyPopulatedEntry({
    fields: createFullyPopulatedAssetType()
  }),
  brand: "AeroDek",
  description: createRichText(),
  featuredMedia: createFullyPopulatedEntry({
    fields: createFullyPopulatedImage()
  }),
  noIndex: false,
  ...contentfulDocument
});

const createContentfulDocument = (
  contentfulDocument?: Partial<Document>
): Document => ({
  asset: createAsset(),
  assetType: createEntry({ fields: createAssetType() }),
  title: "contentful document title",
  ...contentfulDocument
});

export default createContentfulDocument;
