type HTML = string;

type AssetAssetType = "ASSEMBLY_INSTRUCTIONS"; // TODO: there are more

export type Asset = {
  allowedToDownload: boolean;
  assetType: AssetAssetType;
  fileSize: number;
  mime: "application/pdf"; // TODO
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

// TODO: Distinction between ImageAssetType and AssetAssetType might make sense if they're enforced as different in PIM?
type ImageAssetType = string; // "MASTER_IMAGE"; // TODO: others
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
// Seems like a type of an Asset
export type Image = {
  allowedToDownload: boolean;
  assetType: ImageAssetType;
  containerId: string;
  fileSize: number;
  format?: string; //ImageFormat;
  mime: string; // "image/jpeg"; // TODO
  name: string;
  realFileName: string; // includes file extension
  url: string;
};

type ClassificationCode =
  | "scoringWeightAttributes"
  | "appearanceAttributes"
  | "measurements"
  | "generalInformation"; // TODO: there are more

type ClassificationFeatureCode = string; // Contains namespaces prefix, cannot enumerate

export type FeatureValue = {
  value: string;
  code?: string;
};

export type Feature = {
  code: ClassificationFeatureCode;
  featureValues: readonly FeatureValue[];
  featureUnit?: {
    symbol: string;
  };
  name: string;
};

export type Classification = {
  code: string; // ClassificationCode;
  features?: Feature[];
  name: string;
};

export type ApprovalStatus = "approved" | "check" | "unapproved";

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
