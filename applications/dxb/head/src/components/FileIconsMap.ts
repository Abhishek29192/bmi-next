import {
  FileDOCX,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  FileSVG,
  FileTXT,
  FileXLSX,
  FileZIP
} from "@bmi-digital/components";
import React from "react";
import { Format } from "./types";

const fileIconsMap: Record<Format, React.ComponentType> = {
  "application/pdf": FilePDF,
  "application/zip": FileZIP,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FileDOCX,
  "image/jpg": FileJPG,
  "image/jpeg": FileJPEG,
  "image/png": FilePNG,
  "image/svg+xml": FileSVG,
  "text/plain": FileTXT,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileXLSX
};

export default fileIconsMap;
