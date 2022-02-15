import { PIMDocumentData } from "./types/PIMDocumentBase";

export interface AssetUniqueFileCountMap {
  uniqueFileMap: { [fileName: string]: number };
  fileIndexCount: number[];
}

const createAssetFileCountMap = (
  assets: PIMDocumentData[]
): AssetUniqueFileCountMap => {
  const uniqueFileMap = {};
  const fileIndexCount = assets.map((asset) => {
    const fName =
      asset.realFileName ||
      `${asset.title}${asset.extension ? `.${asset.extension}` : ""}`;
    // eslint-disable-next-line security/detect-object-injection
    return (uniqueFileMap[fName] =
      // eslint-disable-next-line security/detect-object-injection
      typeof uniqueFileMap[fName] === "undefined"
        ? 1
        : // eslint-disable-next-line security/detect-object-injection
          uniqueFileMap[fName] + 1);
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
    : // eslint-disable-next-line security/detect-object-injection
      `${title}-${assetFileCountMap.fileIndexCount[index]}.${extension}`;
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
        // eslint-disable-next-line security/detect-object-injection
        assetFileCountMap.fileIndexCount[index]
      }.${asset.extension}`;
};
export default createAssetFileCountMap;
