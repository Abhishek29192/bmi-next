import type {
  ApprovalStatus,
  BaseProduct,
  Classification,
  Image
} from "@bmi/pim-types";

export type Operation = "index" | "delete" | "create" | "update";

export type BulkOperationInstruction = any; // TODO

type Category = {
  code: string;
  parentCategoryCode: string;
};

export type ProductVariant = {
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
  images: readonly Image[]; // Needed
  allCategories: readonly Category[];
  classifications: readonly Classification[];
  approvalStatus: ApprovalStatus;
  productScoringWeightInt: number;
  variantScoringWeightInt: number;
  totalVariantCount: number;
} & {
  [extractedFilter: string]: any;
};
