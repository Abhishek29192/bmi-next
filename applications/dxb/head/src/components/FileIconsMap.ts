import { Format } from "./types";
import { IconName } from "./Icon";

const fileIconsMap: Record<Format, IconName> = {
  "application/pdf": "FilePDF",
  "application/zip": "FileZIP",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "FileDOCX",
  "image/jpg": "FileJPG",
  "image/jpeg": "FileJPEG",
  "image/png": "FilePNG",
  "image/svg+xml": "FileSVG",
  "text/plain": "FileTXT",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "FileXLSX"
};

export default fileIconsMap;
