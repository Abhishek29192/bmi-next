import {
  Image,
  ClassificationFeatureUnit,
  Product
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
  code?: string;
};

export type FeatureValue = { value: string };

export type Feature = {
  code: string;
  featureValues: FeatureValue[];
  name: string;
  featureUnit?: ClassificationFeatureUnit;
};

export type Classification = {
  code:
    | "systemAttributes"
    | "measurementAttributes"
    | "scoringWeightAttributes"
    | "ScoringWeightAttributes"
    | "uniquesellingpropositionsAttributes";
  features: Feature[];
  name: string;
};

export type AssetType =
  | "BIM"
  | "WARRANTIES"
  | "AWARDS"
  | "GUARANTIES"
  | "CERTIFICATES"
  | "SPECIFICATION"
  | "CAD"
  | "DATA_SHEETS";

export type MimeType =
  | "image/jpeg"
  | "image/png"
  | "image/tiff"
  | "application/pdf";

export type Assets = {
  allowedToDownload: boolean;
  assetType: AssetType;
  fileSize?: number;
  mime: MimeType;
  name: string;
  realFileName: string; // includes file extension
  url: string;
  format?: string;
};

export type SystemBenefits = string[];

interface ProductCode {
  code: string;
}

export type SystemLayer = {
  addon: boolean;
  approvalStatus: "approved" | "unapproved";
  code: string;
  images: Image[];
  layerNumber: number;
  longDescription: string;
  name: string;
  optionalProducts: ProductCode[];
  products: ProductCode[];
  shortDescription: string;
  type: string;
  relatedOptionalProducts: Product[];
  relatedProducts: Product[];
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
