export type System = {
  type: string;
  approvalStatus: ApprovalStatus;
  assets: readonly Asset[];
  categories: readonly Category[];
  classifications?: readonly Classification[];
  code: string;
  images: readonly Image[];
  longDescription: HTML;
  name: string;
  shortDescription: string;
  systemBenefits?: string[];
  systemLayers: SystemLayer[];
  systemReferences: SystemReference[];
  description: HTML;
};

export type ApprovalStatus = "approved" | "check" | "unapproved";

type HTML = string;

export type AssetAssetType =
  | "AWARDS"
  | "BIM"
  | "CAD"
  | "CERTIFICATES"
  | "DATA_SHEETS"
  | "GUARANTIES"
  | "SPECIFICATION"
  | "WARRANTIES";

type Mime =
  | "application/octet-stream"
  | "application/pdf"
  | "image/jpeg"
  | "image/png";

export type Asset = {
  allowedToDownload: boolean;
  assetType: AssetAssetType;
  fileSize: number;
  mime?: Mime;
  name: string;
  realFileName: string; // includes file extension
  url: string;
  format?: string;
};

export type CategoryImage = {
  allowedToDownload: boolean;
  fileSize: number;
  mime: "image/png";
  name: string;
  realFileName: string; // includes file extension
  url: string;
};

type CategoryType = "Brand" | "Category" | "ProductFamily" | "ProductLine";

export type Category = {
  categoryType?: CategoryType;
  code: string;
  image?: CategoryImage;
  name?: string;
  parentCategoryCode?: string;
};

export type ImageMime = "image/jpeg" | "image/png" | "image/tiff";

export type Image = {
  allowedToDownload: boolean;
  assetType: string;
  containerId: string;
  fileSize: number;
  format?: string;
  mime: ImageMime;
  name: string;
  realFileName: string; // includes file extension
  url: string;
};

export type FeatureValue = {
  value: string;
  code?: string;
};

export type FeatureUnit = {
  name: string;
  symbol: string;
  unitType: string;
};

type ClassificationFeatureCode = string; // Contains namespaces prefix, cannot enumerate

export type Classification = {
  code: string; // ClassificationCode;
  features?: Feature[];
  name: string;
};

export type Feature = {
  code: ClassificationFeatureCode;
  featureValues: readonly FeatureValue[];
  featureUnit?: FeatureUnit;
  name: string;
};

type Product = {
  code: string;
};

export type SystemLayer = {
  addon: boolean;
  approvalStatus: ApprovalStatus;
  code: string;
  layerNumber: number;
  longDescription: string;
  optionalProducts?: Product[];
  products?: Product[];
  shortDescription?: string;
  type?: string;
};

export type SystemReferenceTarget = {
  code: string;
  name?: string;
};

export type SystemReference = {
  referenceType: string;
  target: SystemReferenceTarget;
  preselected: boolean;
};
