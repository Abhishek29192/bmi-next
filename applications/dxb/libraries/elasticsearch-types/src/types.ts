import type {
  ApprovalStatus,
  Asset,
  BaseProduct,
  Classification,
  Mime,
  Category as PimCategory,
  Image as PimImage,
  System as PimSystem,
  ProductReferenceType,
  ReferenceTarget
} from "@bmi/pim-types";

export type Category = {
  code: string;
  parentCategoryCode: string;
};

export type ProductReference = ReferenceTarget & {
  type: ProductReferenceType;
};

export type Product = {
  description: string;
  externalProductCode: string;
  isSampleOrderAllowed: boolean;
  longDescription: string;
  productBenefits?: string[];
  shortDescription: string; // Needed
  summary: string;
  name: string;
  code: string; // Needed
  baseProduct?: BaseProduct; // Needed
  brandCode?: string; // Needed
  images: PimImage[]; // Needed
  allCategories: Category[];
  classifications: Classification[];
  approvalStatus: ApprovalStatus;
  productScoringWeightInt: number;
  variantScoringWeightInt: number;
  totalVariantCount: number;
  mainImage: string;
  path: string;
  subTitle: string;
  productReferences?: ProductReference[];
  visualiserAssets?: readonly Asset[];
  keywords?: string[];
} & {
  [extractedFilter: string]: any;
};

export type Image = {
  mainSource?: string;
  thumbnail?: string;
  altText?: string;
};

type systemAttribute = {
  name: string;
  code: string;
  values: string[];
};

export type System = {
  approvalStatus: PimSystem["approvalStatus"];
  brand?: PimCategory;
  code: string;
  hashedCode: string;
  galleryImages: readonly Image[];
  masterImage?: Image;
  name: string;
  path: string;
  scoringWeight: number;
  systemAttributes?: systemAttribute[];
  shortDescription?: string;
  type?: string;
};

export type ContentfulAssetType = {
  name: string;
  code: string;
};

export type ContentfulImage = {
  altText: string;
  image: {
    file: {
      fileName: string;
      url: string;
    };
  };
  title: string;
  // TODO: is type needed if we don't consume focal point?
  type?: "Decorative" | "Descriptive";
  focalPoint?: { x: number; y: number };
};

export type ContentfulDocument = {
  __typename: "ContentfulDocument";
  id: string;
  title: string;
  titleAndSize: string;
  realFileName: string;
  assetType: ContentfulAssetType;
  featuredMedia?: ContentfulImage;
  asset: {
    file: {
      url: string;
      fileName: string;
      contentType: string;
      details: {
        size: number;
      };
    };
  };
  // TODO: Should this be defined like this?
  BRAND?: {
    name: string;
    code: string;
  };
  noIndex: boolean;
};

export type PimDocumentBase = {
  id: string;
  approvalStatus: ApprovalStatus;
  title: string;
  url: string;
  assetType: {
    code: string;
    name: string;
    pimCode: string;
  };
  isLinkDocument: boolean;
  fileSize: number;
  format?: Mime | string;
  extension: string;
  realFileName: string;
  titleAndSize: string;
  noIndex: boolean;
  validUntil?: number;
} & {
  [extractedFilter: string]: any;
};

export type PimSystemDocument = PimDocumentBase & {
  __typename: "PIMSystemDocument";
};

export type PimProductDocument = PimDocumentBase & {
  __typename: "PIMDocument";
  productBaseCode: string;
  productName: string;
};

export type ClassificationField = {
  code: string;
  value: string;
  name: string;
}[];
