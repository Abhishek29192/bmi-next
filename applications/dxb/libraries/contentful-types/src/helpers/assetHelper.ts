import createContentfulDate from "./contentfulDateHelper";
import type { Asset } from "contentful";
import type { AssetPartial } from "./helperTypes";

export const createFullyPopulatedAsset = (
  contentfulAsset?: AssetPartial<Asset<undefined, "en-US">>
): Asset<undefined, "en-US"> => {
  const asset = createAsset(contentfulAsset);
  return {
    ...asset,
    fields: {
      title: "asset title",
      description: "asset description",
      ...asset?.fields
    }
  };
};

const createAsset = (
  contentfulAsset?: AssetPartial<Asset<undefined, "en-US">>
): Asset<undefined, "en-US"> => ({
  sys: {
    space: {
      sys: { type: "Link", linkType: "Space", id: "master" }
    },
    id: "asset-id",
    type: "Asset",
    createdAt: createContentfulDate(0),
    updatedAt: createContentfulDate(1),
    environment: {
      sys: { type: "Link", linkType: "Environment", id: "master" }
    },
    revision: 1,
    locale: "en-US",
    ...contentfulAsset?.sys
  },
  metadata: { tags: [], ...contentfulAsset?.metadata },
  fields: {
    file: {
      url: "https://localhost:9000/asset-filename.pdf",
      details: {
        size: 1
      },
      fileName: "asset-filename.pdf",
      contentType: "application/pdf"
    },
    ...contentfulAsset?.fields
  }
});

export default createAsset;
