import { iconMap } from "@bmi-digital/components";
import React from "react";
import { Format } from "./types";

const fileIconsMap: Record<Format, React.ComponentType> = {
  "application/pdf": iconMap.FilePDF,
  "application/zip": iconMap.FileZIP,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    iconMap.FileDOCX,
  "image/jpg": iconMap.FileJPG,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG,
  "image/svg+xml": iconMap.FileSVG,
  "text/plain": iconMap.FileTXT,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    iconMap.FileXLSX
};

export default fileIconsMap;
