import type {
  ApprovalStatus,
  AssetTypeData,
  BaseProduct,
  Category as PimCategory,
  Classification,
  Image as PimImage,
  PIMDocumentBase,
  PIMDocumentData,
  PIMLinkDocumentData,
  ProductReferenceType,
  ReferenceTarget,
  System as PimSystem
} from "@bmi/pim-types";

export type Operation = "index" | "delete" | "create" | "update";

export type BulkOperationInstruction = any; // TODO

export type EsPIMDocumenBase = Omit<
  PIMDocumentBase,
  "assetType" | "product"
> & {
  assetType: Pick<AssetTypeData, "code" | "name" | "pimCode">;
  productBaseCode: string;
  productName: string;
  noIndex: boolean;
} & {
  [extractedFilter: string]: any;
};

export type EsPIMDocumentData = EsPIMDocumenBase &
  PIMDocumentData & { titleAndSize: string };
export type EsPIMLinkDocumentData = EsPIMDocumenBase & PIMLinkDocumentData;

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
