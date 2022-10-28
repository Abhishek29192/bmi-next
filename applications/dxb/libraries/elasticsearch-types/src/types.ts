import type {
  ApprovalStatus,
  Asset,
  BaseProduct,
  Category as PimCategory,
  Classification,
  Image as PimImage,
  Mime,
  ProductReferenceType,
  ReferenceTarget,
  System as PimSystem
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
} & {
  [extractedFilter: string]: any;
};

export type Image = {
  mainSource?: string;
  thumbnail?: string;
  altText?: string;
};

export type System = {
  approvalStatus: PimSystem["approvalStatus"];
  brand?: PimCategory;
  code: string;
  hashedCode: string;
  images: readonly Image[];
  name: string;
  path: string;
  scoringWeight: number;
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

type PimDocumentBase = {
  id: string;
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
