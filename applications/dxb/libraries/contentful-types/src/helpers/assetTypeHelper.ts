import createRichText from "./richTextHelper";
import createEntrySys from "./entrySysHelper";
import type { TypeAssetType } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedAssetType = (
  contentfulAssetType?: EntryPartial<TypeAssetType<undefined, "en-US">>
): TypeAssetType<undefined, "en-US"> => {
  const assetType = createAssetType(contentfulAssetType);
  return {
    ...assetType,
    fields: {
      description: createRichText(),
      pimCode: "pim-code",
      ...assetType.fields
    }
  };
};

const createAssetType = (
  contentfulAssetType?: EntryPartial<TypeAssetType<undefined, "en-US">>
): TypeAssetType<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "assetType"
      }
    },
    ...contentfulAssetType?.sys
  },
  metadata: {
    tags: [],
    ...contentfulAssetType?.metadata
  },
  fields: {
    code: "contentful asset type code",
    name: "contentful asset type name",
    ...contentfulAssetType?.fields
  }
});

export default createAssetType;
