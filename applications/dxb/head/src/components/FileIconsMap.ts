interface FileIconsMap {
  [key: string]: string;
}

const fileIconsMap: FileIconsMap = {
  "application/zip": "ZipFile",
  "application/pdf": "PDFFile",
  "image/jpg": "JPGFile",
  "image/jpeg": "JPEGFile",
  "image/png": "PNGFile",
  "image/svg+xml": "SVGFile",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "WordFile",
  "text/plain": "TextFile",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "ExcelFile"
};

export default fileIconsMap;
