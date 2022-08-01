import { Asset } from "./types";

const createAsset = (asset?: Partial<Asset>): Asset => ({
  allowedToDownload: true,
  assetType: "AWARDS",
  fileSize: 10,
  format: "pdf",
  mime: "application/pdf",
  name: "name",
  realFileName: "real-file-name.pdf",
  url: "http://localhost:8000",
  ...asset
});

export default createAsset;
