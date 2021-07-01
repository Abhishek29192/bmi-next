"use strict";

const path = require("path");

const mapExtensionToFormat = {
  pdf: "application/pdf",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png"
};

const MAX_SIZE_ALLOWED_BYTES = 41943040; // 40MB

exports.mapExtensionToFormat = mapExtensionToFormat;

exports.getFormatFromFileName = (filename) =>
  mapExtensionToFormat[path.extname(filename).substr(1)];

exports.isPimLinkDocument = (asset) => {
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
