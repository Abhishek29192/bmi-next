import type { FileData as AssetData } from "../../components/EmbeddedAssetBlock";

const createAsset = (asset?: Partial<AssetData>): AssetData => ({
  __typename: "Asset",
  title: "Asset title",
  contentType: "image/jpg",
  url: "http://localhost:3000/fake-jpg-image.jpg",
  ...asset
});

export default createAsset;
