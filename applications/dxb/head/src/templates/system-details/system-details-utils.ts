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
  altText?: string;
  allowedToDownload: boolean;
  realFileName: string;
};

export type Category = {
  categoryType: string;
  name: string;
  image?: SystemImageType;
};

export type Feature = {
  code:
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent";
  featureValues: { value: string }[];
  name: string;
};

export type Classification = {
  code: "systemAttributes" | "measurementAttributes";
  features: Feature[];
  name: string;
};

export interface SystemDetails {
  type?: string;
  approvalStatus?: string;
  code?: string;
  assets: any[];
  name: string;
  categories: Category[];
  classifications: Classification[];
  images: SystemProductImageType[] | null;
  longDescription?: string;
  shortDescription?: string;
  systemBenefits?: string[];
  systemLayers?: any[];
  systemReferences?: any[];
}
