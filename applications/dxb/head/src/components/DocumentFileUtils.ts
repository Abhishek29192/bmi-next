export interface AssetUniqueFileCountMap {
  uniqueFileMap: { [fileName: string]: number };
  fileIndexCount: number[];
}
interface uniqueFileMap {
  [key: string]: number;
}

const createAssetFileCountMap = (
  assets: {
    title: string;
    extension: string | null;
    realFileName: string | null;
  }[]
): AssetUniqueFileCountMap => {
  const uniqueFileMap: uniqueFileMap = {};
  const fileIndexCount = assets.map((asset) => {
    const fName = asset.title
      ? `${asset.title}${asset.extension ?? "" ? `.${asset.extension}` : ""}`
      : asset.realFileName ?? "";

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
  asset: { extension: string | null; realFileName: string | null },
  index: number
): string => {
  if (!asset.realFileName) {
    return "";
  }
  if (!assetFileCountMap.uniqueFileMap[asset.realFileName]) {
    return asset.realFileName;
  }
  const extension = asset.extension || "";
  return assetFileCountMap.uniqueFileMap[asset.realFileName] === 1
    ? asset.realFileName
    : `${asset.realFileName.split(".").shift()}-${
        // eslint-disable-next-line security/detect-object-injection
        assetFileCountMap.fileIndexCount[index]
      }.${extension}`;
};
export default createAssetFileCountMap;
