"use strict";

const path = require("path");

const mapExtensionToFormat = {
  pdf: "application/pdf",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png"
};

exports.mapExtensionToFormat = mapExtensionToFormat;

exports.getFormatFromFileName = (filename) =>
  mapExtensionToFormat[path.extname(filename).substr(1)];
