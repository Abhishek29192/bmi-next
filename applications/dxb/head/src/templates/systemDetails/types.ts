import {
  Image,
  ClassificationFeatureUnit
} from "../../components/types/ProductBaseTypes";

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

export type FeatureValue = { value: string };

export type Feature = {
  code:
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofbuildup"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.keyfeatures"
    | "bmiSystemsClassificationCatalog/1.0/systemAttributes.scoringweight"
    | "bmiSystemsClassificationCatalog/1.0/Measurements.width"
    | "bmiSystemsClassificationCatalog/1.0/Measurements.length";
  featureValues: FeatureValue[];
  name: string;
  featureUnit?: ClassificationFeatureUnit;
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
  systemLayers?: any[];
  systemReferences?: any[];
}
