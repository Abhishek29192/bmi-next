import type { AssetLink } from "contentful";

const createAssetLink = (assetLink?: Partial<AssetLink>): AssetLink => ({
  type: "Link",
  linkType: "Asset",
  id: "asset-link-id",
  ...assetLink
});

export default createAssetLink;
