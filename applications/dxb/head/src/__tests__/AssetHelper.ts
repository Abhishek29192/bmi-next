import { Asset } from "../components/types/pim";

const createAsset = (asset?: Partial<Asset>): Asset => ({
  allowedToDownload: false,
  assetType: "ASSEMBLY_INSTRUCTIONS",
  fileSize: 10,
  format: "asset-format",
  mime: "application/pdf",
  name: "asset-name",
  realFileName: "asset-real-file-name.pdf",
  url: "http://localhost:8000/asset-real-file-name.pdf",
  ...asset
});

export default createAsset;
