import type {
  ApprovalStatus,
  Classification,
  Image,
  Product
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
  baseProduct: Product; // Needed
  brandCode?: string; // Needed
  images: readonly Image[]; // Needed
  categories: readonly Category[];
  allCategories: readonly Category[];
  plpCategories: readonly Category[];
  classifications: readonly Classification[];
  scoringWeight?: string;
  scoringWeightInt: number;
  colourfamilyCode?: string;
  colourfamilyValue?: string;
  texturefamilyCode?: string;
  texturefamilyValue?: string;
  materialsCode?: string;
  materialsValue?: string;
  measurementValue?: string;
  approvalStatus: ApprovalStatus;
} & {
  [extractedFilter: string]: any;
};
