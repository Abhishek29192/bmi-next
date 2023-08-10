interface FileIconsMap {
  [key: string]: string;
}

const fileIconsMap: FileIconsMap = {
  "application/zip": "FileZIP",
  "application/pdf": "FilePDF",
  "image/jpg": "FileJPG",
  "image/jpeg": "FileJPEG",
  "image/png": "FilePNG",
  "image/svg+xml": "FileSVG",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "FileDOCX",
  "text/plain": "FileTXT",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "FileXLSX"
};

export default fileIconsMap;
