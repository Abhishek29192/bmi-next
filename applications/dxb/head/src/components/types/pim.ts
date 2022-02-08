import { BreadcrumbItem } from "./BreadcrumbTypeBase";
import { PIMDocumentData } from "./PIMDocumentBase";
import { PIMLinkDocumentData } from "./PIMDocumentBase";

export type System = {
  type?: string | null;
  approvalStatus: ApprovalStatus;
  assets?: readonly Asset[] | null;
  categories?: readonly Category[] | null;
  classifications?: readonly Classification[] | null;
  code: string;
  images?: readonly Image[] | null;
  longDescription: HTML;
  name?: string | null;
  path?: string | null;
  shortDescription?: string | null;
  systemBenefits?: string[] | null;
  systemLayers?: SystemLayer[] | null;
  systemReferences?: SystemReference[] | null;
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
  | "PROFESSIONAL_ARTICLES"
  | "SPECIFICATION"
  | "WARRANTIES"
  | "FIXING_TOOL";

export type Mime =
  | "application/octet-stream"
  | "application/pdf"
  | "image/jpeg"
  | "image/png";

export type Asset = {
  allowedToDownload?: boolean | null;
  assetType: AssetAssetType;
  fileSize?: number | null;
  format?: string | null;
  mime?: Mime | null;
  name: string;
  realFileName?: string | null; // includes file extension
  url: string;
};

// TODO: Is this the same as Image?
export type CategoryImage = {
  allowedToDownload: boolean;
  fileSize: number;
  mime: "image/png";
  name: string;
  realFileName: string; // includes file extension
  url: string;
};

export type Category = {
  categoryType: string;
  code: string;
  image?: CategoryImage | null;
  name: string;
  parentCategoryCode?: string | null;
};

export type ImageMime = "image/jpeg" | "image/png" | "image/tiff";

export enum ImageFormatEnum {
  PRODUCT_HERO_SMALL_DESKTOP_TABLET = "Product-Hero-Small-Desktop-Tablet",
  PRODUCT_HERO_LARGE_DESKTOP = "Product-Hero-Large-Desktop",
  PRODUCT_HERO_MOBILE = "Product-Hero-Mobile",
  PRODUCT_LISTING_CARD_LARGE_DESKTOP = "Product-Listing-Card-Large-Desktop",
  PRODUCT_COLOR_SELECTOR_MOBILE = "Product-Color-Selector-Mobile",
  PRODUCT_COLOR_SELECTOR_SMALL_DESKTOP_TABLET = "Product-Color-Selector-Small-Desktop-Tablet",
  PRODUCT_LISTING_CARD_SMALL_DESKTOP_TABLET = "Product-Listing-Card-Small-Desktop-Tablet",
  PRODUCT_COLOR_SELECTOR_LARGE_DESKTOP = "Product-Color-Selector-Large-Desktop",
  PRODUCT_LISTING_CARD_MOBILE = "Product-Listing-Card-Mobile",
  WEB = "Web",
  PRINT = "Print"
}

export type ImageFormat = ImageFormatEnum;

export type Image = {
  allowedToDownload: boolean;
  altText?: string | null;
  assetType: ImageAssetTypesEnum;
  containerId: string;
  fileSize: number;
  format?: ImageFormat | null;
  mime: ImageMime;
  name: string;
  realFileName: string; // includes file extension
  url: string;
};

export type FeatureValue = {
  value: string;
  code?: string | null;
};

export type FeatureUnit = {
  name: string;
  symbol: string;
  unitType: string;
};

export type Classification = {
  code: string;
  features: Feature[];
  name: string;
};

export type Feature = {
  code: string;
  featureValues: readonly FeatureValue[];
  featureUnit?: FeatureUnit | null;
  name: string;
};

type SystemLayerProduct = {
  code: string;
};

export type SystemLayer = {
  addon?: boolean | null;
  approvalStatus: ApprovalStatus;
  code: string;
  layerNumber: number;
  longDescription: string;
  name?: string | null;
  optionalProducts?: SystemLayerProduct[] | null;
  relatedOptionalProducts?: Product[] | null;
  products?: SystemLayerProduct[] | null;
  relatedProducts?: Product[] | null;
  shortDescription?: string | null;
  type?: string | null;
};

export type SystemReferenceTarget = {
  code: string;
  name?: string | null;
};

export type SystemReference = {
  referenceType?: string | null;
  target?: SystemReferenceTarget | null;
  preselected?: boolean | null;
};

export type VariantOption = {
  approvalStatus: ApprovalStatus;
  classifications?: readonly Classification[] | null;
  code: string;
  externalProductCode?: string | null;
  images: readonly Image[];
  isSampleOrderAllowed: boolean;
  longDescription: HTML;
  shortDescription: string;
  productBenefits?: string[] | null;
  breadcrumbs: BreadcrumbItem[];
  path: string;
};

export type Product = {
  code: string;
  externalProductCode?: string | null;
  description: HTML;
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  assets?: readonly Asset[] | null;
  categories?: readonly Category[] | null;
  classifications?: readonly Classification[] | null;
  images?: readonly Image[] | null;
  isSampleOrderAllowed: boolean;
  longDescription: HTML;
  name: string;
  productBenefits?: ReadonlyArray<string> | null;
  shortDescription: string;
  summary: string;
  variantOptions?: readonly VariantOption[] | null;
};

export type VariantOptionWithProduct = VariantOption & {
  _product: Product;
};

export enum ImageAssetTypesEnum {
  TECHNICAL_DRAWINGS = "TECHNICAL_DRAWINGS",
  MASTER_IMAGE = "MASTER_IMAGE",
  GALLERY = "GALLERY",
  NOT_MASTER_IMAGE = "NOT_MASTER_IMAGE"
}

export enum ClassificationCodeEnum {
  APPEARANCE_ATTRIBUTE = "appearanceAttributes",
  MEASUREMENTS = "measurements",
  GENERAL_INFORMATION = "generalInformation",
  WEIGHT_ATTRIBUTES = "weightAttributes",
  SCORING_WEIGHT_ATTRIBUTES = "scoringWeightAttributes",
  SYSTEM_ATTRIBUTES = "systemAttributes",
  FRANCE_FLAT_SYSTEM_ATTRIBUTES = "franceFlatSystemAttributes"
}

export enum FeatureCodeEnum {
  COLOUR = "colour",
  TEXTURE_FAMILY = "texturefamily",
  COLOUR_FAMILY = "colourfamily",
  MATERIALS = "materials",
  LENGTH = "length",
  WIDTH = "width",
  HEIGHT = "height",
  SCORE_WEIGHT = "scoringweight",
  THICKNESS = "thickness",
  VARIANT_ATTRIBUTE = "variantattribute",
  NET_WEIGHT = "netweight",
  GROSS_WEIGHT = "grossweight",
  WEIGHT_PER_PRICE = "weightperpiece",
  WEIGHT_PER_SQM = "weightpersqm",
  WEIGHT_PER_PALLET = "weightperpallet",
  VOLUME = "volume"
}

export enum FileContentTypeEnum {
  IMAGE_JPG = "image/jpg",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
  IMAGE_WEBP = "image/webp",
  IMAGE_GIF = "image/gif",
  IMAGE_SVG_XML = "image/svg+xml",
  APPLICATION_PDF = "application/pdf",
  APPLICATION_ZIP = "application/zip",
  FILE_NOT_AN_IMAGE = "file/not-an-image",
  APPLICATION_OCTET_STREAM = "application/octet-stream"
}
