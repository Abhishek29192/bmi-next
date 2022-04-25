export type CatalogVersion = "Online" | "Staged";

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  scope: "basic openid";
};

export type ErrorResponse = {
  errors: [
    {
      type: string;
      message: string;
    }
  ];
};

type ApiResponse = {
  catalog: string;
  currentPage: number;
  totalPageCount: number;
};

export type ProductsApiResponse = ApiResponse & {
  products: Product[];
  version: CatalogVersion;
  totalProductCount: number;
};

export type SystemsApiResponse = ApiResponse & {
  systems: System[];
  totalSystemsCount: number;
};

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
  systemLayers?: SystemLayer[] | null;
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
  layerNumber: string;
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

export type BaseProduct = Pick<Product, "code" | "name">;

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
  variantOptions: readonly VariantOption[];
};

export enum PimTypes {
  Products = "products",
  Systems = "systems"
}

export enum TwoOneClassToIgnore {
  bagUomAttributes = "bagUomAttributes",
  canisterUomAttributes = "canisterUomAttributes",
  cartonUomAttributes = "cartonUomAttributes",
  crateUomAttributes = "crateUomAttributes",
  cubicMeterUomAttributes = "cubicMeterUomAttributes",
  drumUomAttributes = "drumUomAttributes",
  eachUomAttributes = "eachUomAttributes",
  kilogramUomAttributes = "kilogramUomAttributes",
  kilometerUomAttributes = "kilometerUomAttributes",
  kilowattUomAttributes = "kilowattUomAttributes",
  literUomAttributes = "literUomAttributes",
  meterUomAttributes = "meterUomAttributes",
  packUomAttributes = "packUomAttributes",
  palletUomAttributes = "palletUomAttributes",
  pieceUomAttributes = "pieceUomAttributes",
  rollsUomAttributes = "rollsUomAttributes",
  squareMeterUomAttributes = "squareMeterUomAttributes"
}

export enum TwoOneAttribToIgnore {
  categoryOfEan11 = "categoryOfEan11",
  denominatorForConversion = "denominatorForConversion",
  ean11 = "ean11",
  grossWeight = "grossWeight",
  height = "height",
  length = "length",
  numeratorForConversion = "numeratorForConversion",
  volume = "volume",
  width = "width",
  unit = "unit",
  uomType = "uomType"
}

export const commonIgnoreList = [
  TwoOneAttribToIgnore.categoryOfEan11,
  TwoOneAttribToIgnore.denominatorForConversion,
  TwoOneAttribToIgnore.ean11,
  TwoOneAttribToIgnore.grossWeight,
  TwoOneAttribToIgnore.height,
  TwoOneAttribToIgnore.length,
  TwoOneAttribToIgnore.numeratorForConversion,
  TwoOneAttribToIgnore.unit,
  TwoOneAttribToIgnore.uomType,
  TwoOneAttribToIgnore.volume,
  TwoOneAttribToIgnore.width
];

type TwoOneClassificationAttributeDictionary = {
  [classKey: string]: TwoOneAttribToIgnore[];
};

export const TwoOneIgnoreDictionary: TwoOneClassificationAttributeDictionary = {
  [TwoOneClassToIgnore.bagUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.canisterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.crateUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.cubicMeterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.eachUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilogramUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilometerUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.kilowattUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.literUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.meterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.packUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.palletUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.pieceUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.rollsUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.squareMeterUomAttributes]: commonIgnoreList,
  [TwoOneClassToIgnore.drumUomAttributes]: [
    TwoOneAttribToIgnore.unit,
    TwoOneAttribToIgnore.uomType
  ],
  [TwoOneClassToIgnore.cartonUomAttributes]: [
    TwoOneAttribToIgnore.unit,
    TwoOneAttribToIgnore.uomType
  ]
};

const extractFeatureCode = (
  pimClassificationNameSpace: string,
  code: string
) => {
  return code.replace(`${pimClassificationNameSpace}/`, "");
};

export const filterTwoOneAttributes = (
  pimClassificationCatalogueNamespace: string,
  classificationCode: string,
  origFeatures: Feature[]
) => {
  // eslint-disable-next-line security/detect-object-injection
  const excludeAttributes = TwoOneIgnoreDictionary[classificationCode];
  return origFeatures.filter((feature) => {
    const featureCode = extractFeatureCode(
      pimClassificationCatalogueNamespace,
      feature.code
    );
    const attributeName = featureCode
      .replace(`${classificationCode}.`, "")
      .toLowerCase();
    if (
      excludeAttributes &&
      excludeAttributes.some(
        (attribute) => attribute.toLowerCase() === attributeName
      )
    ) {
      return false;
    }
    return true;
  });
};
