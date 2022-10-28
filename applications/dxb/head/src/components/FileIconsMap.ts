import React from "react";
import { iconMap } from "@bmi/components";
import { Format } from "./types";

const fileIconsMap: Record<Format, React.ComponentType> = {
  "application/pdf": iconMap.FilePDF,
  "application/zip": iconMap.FileZIP,
  "image/jpg": iconMap.FileJPG,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG
};

export default fileIconsMap;
