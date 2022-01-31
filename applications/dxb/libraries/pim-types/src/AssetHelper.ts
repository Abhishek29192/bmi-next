import { Asset } from "./types";

const createAsset = (asset?: Partial<Asset>): Asset => ({
  allowedToDownload: true,
  assetType: "ASSEMBLY_INSTRUCTIONS",
  fileSize: 10,
  mime: "application/pdf",
  name: "name",
  realFileName: "real-file-name.pdf",
  url: "http://localhost:8000",
  format: "pdf",
  ...asset
});

export default createAsset;
