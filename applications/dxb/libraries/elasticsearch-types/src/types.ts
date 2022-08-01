import type {
  ApprovalStatus,
  BaseProduct,
  Classification,
  Image,
  System as PimSystem
} from "@bmi/pim-types";

export type Operation = "index" | "delete" | "create" | "update";

export type BulkOperationInstruction = any; // TODO

export type Category = {
  code: string;
  parentCategoryCode: string;
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
  images: Image[]; // Needed
  allCategories: Category[];
  classifications: Classification[];
  approvalStatus: ApprovalStatus;
  productScoringWeightInt: number;
  variantScoringWeightInt: number;
  totalVariantCount: number;
  mainImage: string;
  path: string;
  subTitle: string;
} & {
  [extractedFilter: string]: any;
};

export type System = {
  approvalStatus: PimSystem["approvalStatus"];
  brand?: string;
  type: PimSystem["type"];
  images: PimSystem["images"];
  code: PimSystem["code"];
  name: PimSystem["name"];
  shortDescription: PimSystem["shortDescription"];
  hashedCode: string;
  path: string;
};
