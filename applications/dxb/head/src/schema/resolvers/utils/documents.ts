import path from "path";
import { Asset } from "../../../components/types/pim";

const MAX_SIZE_ALLOWED_BYTES = 41943040; // 40MB

export const mapExtensionToFormat = {
  pdf: "application/pdf",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png"
};

export const getFormatFromFileName = (filename: string): string =>
  mapExtensionToFormat[path.extname(filename).substr(1)];

export const isPimLinkDocument = (asset: Asset) => {
  // TODO: We're forced to do this because PIM doesn't have the correct data
  // wrt allowedToDownload.
  const { allowedToDownload, url, fileSize, realFileName } = asset;

  if (!allowedToDownload) {
    return true;
  }

  if (fileSize > MAX_SIZE_ALLOWED_BYTES) {
    return true;
  }

  return !fileSize && !realFileName && !!url;
};
