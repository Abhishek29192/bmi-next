import { Image } from "../../components/types/ProductBaseTypes";

export type GalleryImageType = {
  mainSource: string;
  thumbnail: string;
  altText: string;
};

export type CategoryImage = {
  allowedToDownload: boolean;
  fileSize: number;
  mime: string;
  name: string;
  realFileName: string;
  url: string;
};

export type Category = {
  categoryType: string;
  name: string;
  image?: CategoryImage;
};

export type Feature = {
  code:
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures";
  featureValues: { value: string }[];
  name: string;
};

export type Classification = {
  code: "systemAttributes" | "measurementAttributes";
  features: Feature[];
  name: string;
};

export type AssetType =
  | "BIM"
  | "WARRANTIES"
  | "AWARDS"
  | "GUARANTIES"
  | "CERTIFICATES"
  | "SPECIFICATION";

export type MimeType =
  | "image/jpeg"
  | "image/png"
  | "image/tiff"
  | "application/pdf";

export type Assets = {
  allowedToDownload: boolean;
  assetType: AssetType;
  fileSize: number;
  mime: MimeType;
  name: string;
  realFileName: string; // includes file extension
  url: string;
  format?: string;
};

export type SystemBenefits = string[];

export type SystemLayer = {
  addon: boolean;
  approvalStatus: "approved" | "unapproved";
  code: string;
  images: Image[];
  layerNumber: number;
  longDescription: string;
  name: string;
  optionalProducts: {
    code: string;
  }[];
  products: {
    code: string;
  }[];
  shortDescription: string;
  type: string;
};

export interface SystemDetails {
  type?: string;
  approvalStatus?: string;
  code?: string;
  assets: Assets[];
  name: string;
  categories: Category[];
  classifications: Classification[];
  images: Image[] | null;
  longDescription: string;
  shortDescription?: string;
  systemBenefits: SystemBenefits;
  systemLayers?: SystemLayer[];
  systemReferences?: any[];
}
