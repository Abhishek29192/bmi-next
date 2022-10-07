import createRichText from "./richTextHelper";
import { AssetType } from "./types";

export const createFullyPopulatedAssetType = (
  contentfulAssetType?: Partial<AssetType>
): AssetType => ({
  ...createAssetType(),
  description: createRichText(),
  pimCode: "pim-code",
  ...contentfulAssetType
});

const createAssetType = (
  contentfulAssetType?: Partial<AssetType>
): AssetType => ({
  code: "contentful asset type code",
  name: "contentful asset type name",
  ...contentfulAssetType
});

export default createAssetType;
