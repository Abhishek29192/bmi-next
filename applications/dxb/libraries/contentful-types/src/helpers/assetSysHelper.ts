import createContentfulDate from "./contentfulDateHelper";
import type { AssetSys } from "contentful";

const createAssetSys = (assetSys?: Partial<AssetSys>): AssetSys => ({
  type: "Asset",
  id: "asset-id",
  createdAt: createContentfulDate(0),
  updatedAt: createContentfulDate(1),
  locale: "en-US",
  revision: 0,
  space: {
    sys: { type: "Link", linkType: "Space", id: "space-id" }
  },
  environment: {
    sys: { type: "Link", linkType: "Environment", id: "master" }
  },
  ...assetSys
});

export default createAssetSys;
