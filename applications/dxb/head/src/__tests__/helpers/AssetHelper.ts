import { Asset } from "../../types/pim";

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
export const createImageAsset = (asset?: Partial<Asset>): Asset => ({
  allowedToDownload: true,
  assetType: "GUARANTIES",
  fileSize: 10,
  format: "image/jpg",
  mime: "image/jpg",
  name: "asset-name",
  realFileName: "asset-real-file-name.jpg",
  url: "http://localhost:8000/asset-real-file-name.jpg",
  ...asset
});
export const createLinkAsset = (asset?: Partial<Asset>): Asset => ({
  allowedToDownload: false,
  assetType: "WARRANTIES",
  fileSize: null,
  format: null,
  mime: null,
  name: null,
  realFileName: null,
  url: "http://localhost:8000/",
  ...asset
});

export default createAsset;
