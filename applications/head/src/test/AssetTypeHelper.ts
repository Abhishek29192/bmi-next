import { Data as AssetTypeData } from "../components/AssetType";
import createRichText from "./RichTextHelper";

const createAssetType = (
  assetType?: Partial<AssetTypeData>
): AssetTypeData => ({
  __typename: "ContentfulAssetType",
  id: "asset-id",
  name: "asset-name",
  code: "asset-code",
  description: createRichText(),
  pimCode: "asset-pim-code",
  ...assetType
});

export default createAssetType;
