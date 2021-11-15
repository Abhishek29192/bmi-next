export type System = {
  type?: string;
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
  | "ASSEMBLY_INSTRUCTIONS"
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
  categoryType: CategoryType;
  code: string;
  image?: CategoryImage;
  name: string;
  parentCategoryCode: string;
};

export type ImageMime = "image/jpeg" | "image/png" | "image/tiff";

type ImageFormat =
  | "Product-Hero-Small-Desktop-Tablet"
  | "Product-Hero-Large-Desktop"
  | "Product-Hero-Mobile"
  | "Product-Listing-Card-Large-Desktop"
  | "Product-Color-Selector-Mobile"
  | "Product-Color-Selector-Small-Desktop-Tablet"
  | "Product-Listing-Card-Small-Desktop-Tablet"
  | "Product-Color-Selector-Large-Desktop"
  | "Product-Listing-Card-Mobile"
  | "Web"
  | "Print";

export type Image = {
  allowedToDownload: boolean;
  assetType: string;
  containerId: string;
  fileSize: number;
  format?: ImageFormat;
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

export type Classification = {
  code: string; // ClassificationCode;
  features?: Feature[];
  name: string;
};

export type Feature = {
  code: string;
  featureValues: readonly FeatureValue[];
  featureUnit?: FeatureUnit;
  name: string;
};

type SystemLayerProduct = {
  code: string;
};

export type SystemLayer = {
  addon: boolean;
  approvalStatus: ApprovalStatus;
  code: string;
  layerNumber: number;
  longDescription: string;
  optionalProducts?: SystemLayerProduct[];
  products?: SystemLayerProduct[];
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

export type VariantOption = {
  approvalStatus: ApprovalStatus;
  classifications?: readonly Classification[];
  code: string;
  externalProductCode: string; // NOBB
  images: readonly Image[];
  isSampleOrderAllowed: boolean;
  longDescription: HTML;
  shortDescription: string;
  productBenefits?: string[];
};

export type Product = {
  approvalStatus: ApprovalStatus;
  code: string;
  externalProductCode: string | null; // Technically ?: but doing this to match head types
  description: HTML;
  assets: readonly Asset[];
  categories: readonly Category[];
  classifications?: readonly Classification[];
  images: readonly Image[];
  isSampleOrderAllowed: boolean;
  longDescription: HTML;
  name: string;
  shortDescription: string;
  summary: string;
  variantOptions?: readonly VariantOption[];
};

export enum ClassificationCodeEnum {
  APPEARANCE_ATTRIBUTE = "appearanceAttributes",
  MEASUREMENTS = "measurements",
  GENERAL_INFORMATION = "generalInformation"
}

export enum FeatureCodeEnum {
  COLOUR = "colour",
  TEXTURE_FAMILY = "texturefamily",
  COLOUR_FAMILY = "colourfamily",
  MATERIALS = "materials",
  LENGTH = "length",
  WIDTH = "width",
  HEIGHT = "height",
  VARIANT_ATTRIBUTE = "variantattribute"
}
