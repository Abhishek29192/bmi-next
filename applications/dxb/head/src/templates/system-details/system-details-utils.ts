export type GalleryImageType = {
  mainSource: string;
  thumbnail: string;
  altText: string;
};

export type SystemProductImageType = SystemImageType & {
  format: string;
  containerId: string;
};

export type SystemImageType = {
  url: string;
  name: string;
  mime: string;
  fileSize: number;
  containerId: string;
  assetType: string;
  altText: string;
  allowedToDownload: boolean;
  realFileName: string;
};
