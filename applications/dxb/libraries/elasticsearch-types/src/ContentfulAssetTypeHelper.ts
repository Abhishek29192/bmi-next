import { ContentfulAssetType } from "./types";

const createContentfulAssetType = (
  contentfulAssetType?: Partial<ContentfulAssetType>
): ContentfulAssetType => ({
  code: "contentful-asset-type-code",
  name: "contentful asset type name",
  ...contentfulAssetType
});

export default createContentfulAssetType;
