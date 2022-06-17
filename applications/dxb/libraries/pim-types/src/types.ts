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
  assets?: readonly Asset[];
  categories: readonly Category[];
  classifications?: readonly Classification[];
  code: string;
  images: readonly Image[];
  longDescription: HTML;
  name: string;
  shortDescription: string;
  systemBenefits?: string[];
  systemLayers?: SystemLayer[];
  systemReferences?: SystemReference[];
  description?: HTML;
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
  | "FIXING_TOOL"
  | "GUARANTIES"
  | "SPECIFICATION"
  | "VIDEO"
  | "WARRANTIES";

export type Mime =
  | "application/octet-stream"
  | "application/pdf"
  | "application/zip"
  | "image/gif"
  | "image/jpg"
  | "image/jpeg"
  | "image/png"
  | "image/svg+xml"
  | "image/webp";

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

export type CategoryType =
  | "Brand"
  | "Category"
  | "ProductFamily"
  | "ProductLine";

export type Category = {
  categoryType: CategoryType;
  code: string;
  image?: CategoryImage;
  name: string;
  parentCategoryCode?: string;
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

export type ImageAssetType = "TECHNICAL_DRAWINGS" | "MASTER_IMAGE" | "GALLERY";

export type Image = {
  allowedToDownload: boolean;
  assetType: ImageAssetType;
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
  code: ClassificationCode;
  features?: Feature[];
  name: string;
};

export type ClassificationCode =
  | "appearanceAttributes"
  | "bagUomAttributes"
  | "canisterUomAttributes"
  | "cartonUomAttributes"
  | "crateUomAttributes"
  | "cubicMeterUomAttributes"
  | "drumUomAttributes"
  | "eachUomAttributes"
  | "franceFlatSystemAttributes"
  | "generalInformation"
  | "kilogramUomAttributes"
  | "kilometerUomAttributes"
  | "kilowattUomAttributes"
  | "literUomAttributes"
  | "measurements"
  | "meterUomAttributes"
  | "packUomAttributes"
  | "palletUomAttributes"
  | "pieceUomAttributes"
  | "rollsUomAttributes"
  | "scoringWeightAttributes"
  | "squareMeterUomAttributes"
  | "systemAttributes"
  | "weightAttributes"
  | string;

export type Feature = {
  code: FeatureCode;
  featureValues: readonly FeatureValue[];
  featureUnit?: FeatureUnit;
  name: string;
};

export type FeatureCode =
  | "bmiClassificationCatalog/1.0/appearanceAttributes.colour"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute"
  | "bmiClassificationCatalog/1.0/generalInformation.materials"
  | "bmiClassificationCatalog/1.0/measurements.length"
  | "bmiClassificationCatalog/1.0/measurements.width"
  | "bmiClassificationCatalog/1.0/measurements.height"
  | "bmiClassificationCatalog/1.0/measurements.thickness"
  | "bmiClassificationCatalog/1.0/measurements.volume"
  | "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight"
  | "bmiClassificationCatalog/1.0/weightAttributes.netweight"
  | "bmiClassificationCatalog/1.0/weightAttributes.grossweight"
  | "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece"
  | "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm"
  | "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.height"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.length"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/bagUomAttributes.width"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.height"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.length"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/canisterUomAttributes.width"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.height"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.length"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/cartonUomAttributes.width"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.height"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.length"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/crateUomAttributes.width"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.height"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.length"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/cubicMeterUomAttributes.width"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.height"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.length"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/drumUomAttributes.width"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.height"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.length"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/eachUomAttributes.width"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.height"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.length"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/kilogramUomAttributes.width"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.height"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.length"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/kilometerUomAttributes.width"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.height"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.length"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/kilowattUomAttributes.width"
  | "bmiClassificationCatalog/1.0/literUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/literUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/literUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/literUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/literUomAttributes.height"
  | "bmiClassificationCatalog/1.0/literUomAttributes.length"
  | "bmiClassificationCatalog/1.0/literUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/literUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/literUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/literUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/literUomAttributes.width"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.height"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.length"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/meterUomAttributes.width"
  | "bmiClassificationCatalog/1.0/packUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/packUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/packUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/packUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/packUomAttributes.height"
  | "bmiClassificationCatalog/1.0/packUomAttributes.length"
  | "bmiClassificationCatalog/1.0/packUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/packUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/packUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/packUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/packUomAttributes.width"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.height"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.length"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/palletUomAttributes.width"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.height"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.length"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/pieceUomAttributes.width"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.height"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.length"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/rollsUomAttributes.width"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.categoryOfEan11"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.denominatorForConversion"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.ean11"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.grossWeight"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.height"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.length"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.numeratorForConversion"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.unit"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.uomType"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.volume"
  | "bmiClassificationCatalog/1.0/squareMeterUomAttributes.width"
  | "bmiClassificationCatalog/1.0/systemAttributes.keyFeatures"
  | string;

type SystemLayerProduct = {
  code: string;
};

export type SystemLayer = {
  addon: boolean;
  approvalStatus: ApprovalStatus;
  code: string;
  layerNumber: string;
  longDescription: string;
  name: string;
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
  referenceType: "CROSSELLING" | "UPSELLING";
  target: SystemReferenceTarget;
  preselected: boolean;
};

export type VariantOption = {
  approvalStatus: ApprovalStatus;
  classifications?: readonly Classification[];
  code: string;
  externalProductCode?: string;
  images?: readonly Image[];
  isSampleOrderAllowed?: boolean;
  longDescription?: HTML;
  shortDescription: string;
  productBenefits?: string[];
};

export type BaseProduct = Pick<Product, "code" | "name">;

export type Product = {
  approvalStatus: ApprovalStatus;
  code: string;
  externalProductCode?: string;
  description: HTML;
  assets?: readonly Asset[];
  categories?: readonly Category[];
  classifications?: readonly Classification[];
  images?: readonly Image[];
  isSampleOrderAllowed?: boolean;
  longDescription: HTML;
  name: string;
  productBenefits?: string[];
  shortDescription: string;
  summary: string;
  variantOptions?: readonly VariantOption[];
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
