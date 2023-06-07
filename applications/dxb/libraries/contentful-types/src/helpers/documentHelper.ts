import createAsset, { createFullyPopulatedAsset } from "./assetHelper";
import createAssetType, {
  createFullyPopulatedAssetType
} from "./assetTypeHelper";
import { createFullyPopulatedImage } from "./imageHelper";
import createRichText from "./richTextHelper";
import createEntrySys from "./entrySysHelper";
import type { EntryPartial } from "./helperTypes";
import type { TypeDocument } from "../types";

export const createFullyPopulatedDocument = (
  contentfulDocument?: EntryPartial<TypeDocument<undefined, "en-US">>
): TypeDocument<undefined, "en-US"> => {
  const document = createContentfulDocument(contentfulDocument);
  return {
    ...document,
    fields: {
      ...document.fields,
      asset: createFullyPopulatedAsset(),
      assetType: createFullyPopulatedAssetType(),
      brand: "AeroDek",
      description: createRichText(),
      featuredMedia: createFullyPopulatedImage(),
      noIndex: false,
      ...contentfulDocument?.fields
    }
  };
};

const createContentfulDocument = (
  contentfulDocument?: EntryPartial<TypeDocument<undefined, "en-US">>
): TypeDocument<undefined, "en-US"> => {
  return {
    sys: {
      ...createEntrySys(),
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "document"
        }
      },
      ...contentfulDocument?.sys
    },
    metadata: {
      tags: [],
      ...contentfulDocument?.metadata
    },
    fields: {
      asset: createAsset(),
      assetType: createAssetType(),
      title: "contentful document title",
      ...contentfulDocument?.fields
    }
  };
};

export default createContentfulDocument;
