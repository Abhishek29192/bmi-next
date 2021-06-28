import { PIMDocumentData } from "../components/types/PIMDocumentBase";

export interface AssetUniqueFileCountMap {
  uniqueFileMap: { [fileName: string]: number };
  fileIndexCount: number[];
}

const createAssetFileCountMap = (
  assets: PIMDocumentData[]
): AssetUniqueFileCountMap => {
  var uniqueFileMap = {};
  var fileIndexCount = assets.map((asset) => {
    const fName =
      asset.realFileName ||
      `${asset.title}${asset.extension ? `.${asset.extension}` : ""}`;
    return (uniqueFileMap[fName] =
      typeof uniqueFileMap[fName] === "undefined"
        ? 1
        : uniqueFileMap[fName] + 1);
  });
  return { uniqueFileMap, fileIndexCount };
};

export const generateFileNamebyTitle = (
  assetFileCountMap: AssetUniqueFileCountMap,
  title: string,
  extension: string,
  index: number
): string => {
  if (!assetFileCountMap.uniqueFileMap[`${title}.${extension}`]) {
    return `${title}.${extension}`;
  }
  return assetFileCountMap.uniqueFileMap[`${title}.${extension}`] === 1
    ? `${title}.${extension}`
    : `${title}-${assetFileCountMap.fileIndexCount[index]}.${extension}`;
};

export const generateFilenameByRealFileName = (
  assetFileCountMap: AssetUniqueFileCountMap,
  asset: PIMDocumentData,
  index: number
): string => {
  if (!assetFileCountMap.uniqueFileMap[asset.realFileName]) {
    return asset.realFileName;
  }
  return assetFileCountMap.uniqueFileMap[asset.realFileName] === 1
    ? asset.realFileName
    : `${asset.realFileName.split(".").shift()}-${
        assetFileCountMap.fileIndexCount[index]
      }.${asset.extension}`;
};
export default createAssetFileCountMap;
