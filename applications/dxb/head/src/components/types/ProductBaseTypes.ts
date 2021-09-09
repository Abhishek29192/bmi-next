import { BreadcrumbItem } from "./BreadcrumbTypeBase";
import { PIMDocumentData } from "./PIMDocumentBase";
import { PIMLinkDocumentData } from "./PIMDocumentBase";

export type ClassificationFeatureValue = {
  value: string;
  code?: string | null; // This doesn't exist on some Features... perhaps we can be more specific with the types
};

export type ClassificationFeatureUnit = {
  name: string;
  symbol: string;
  unitType: string;
};

export type ClassificationFeature = {
  name: string;
  code: string;
  featureValues: ClassificationFeatureValue[];
  featureUnit?: ClassificationFeatureUnit;
};

export type Classification = {
  name: string;
  code: string;
  features: ClassificationFeature[];
};

export type Image = {
  realFileName: string;
  assetType: string;
  mime: string;
  url: string;
  allowedToDownload: boolean;
  containerId: string;
  fileSize: number;
  name: string;
  format: string;
  altText?: string;
};

export type Asset = {
  realFileName: string;
  assetType: string;
  url: string;
  name: string;
  format?: string;
};

export type Category = {
  name: string;
  categoryType: string; // ENUM?
  code: string;
  parentCategoryCode: string;
};

// TODO: perhaps should be stored somewhere else to export
export type Product = {
  code: string;
  externalProductCode: string | null;
  name: string;
  description: string;
  images?: ReadonlyArray<Image>;
  assets?: ReadonlyArray<Asset>;
  productBenefits?: ReadonlyArray<string>;
  categories?: ReadonlyArray<Category>;
  classifications?: ReadonlyArray<Classification>;
  variantOptions?: ReadonlyArray<VariantOption>;
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  breadcrumbs: null;
};

export type VariantOption = {
  code: string;
  externalProductCode: string | null;
  isSampleOrderAllowed: boolean;
  images: ReadonlyArray<Image>;
  classifications?: ReadonlyArray<Classification>;
  approvalStatus: string;
  shortDescription: string;
  longDescription: string;
  breadcrumbs: BreadcrumbItem[];
  path: string;
};

export type VariantOptionWithProduct = VariantOption & {
  _product: Product;
};
