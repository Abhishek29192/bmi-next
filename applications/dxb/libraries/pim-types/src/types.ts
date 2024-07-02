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
  categoryAssets?: readonly Asset[];
  categories?: readonly Category[];
  classifications?: readonly Classification[];
  code: string;
  images?: readonly Image[];
  longDescription?: HTML;
  name: string;
  shortDescription?: string;
  systemBenefits?: string[];
  systemLayers?: SystemLayer[];
  systemReferences?: SystemReference[];
  description?: HTML;
  goodBetterBest?: GoodBetterBest;
};

export enum ApprovalStatus {
  Approved = "approved",
  Check = "check",
  Unapproved = "unapproved",
  Discontinued = "discontinued",
  Preview = "preview"
}

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
  | "HIGH_DETAIL_MESH_REFERENCE"
  | "DIFFUSE_MAP_REFERENCE"
  | "LOW_DETAIL_MESH_REFERENCE"
  | "METALLIC_ROUGHNESS_MAP_REFERENCE"
  | "NORMAL_MAP_REFERENCE"
  | "RIDGE_END_REFERENCE"
  | "RIDGE_REFERENCE"
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
  | "image/webp"
  | "image/tiff";

export type Asset = {
  allowedToDownload: boolean;
  assetType?: AssetAssetType;
  fileSize: number;
  mime?: Mime;
  name: string;
  realFileName?: string; // includes file extension
  url: string;
  format?: string;
  validUntil?: string;
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
  | "Channel"
  | "ProductFamily"
  | "ProductLine";

export type Category = {
  categoryType: CategoryType;
  code: string;
  image?: CategoryImage;
  name?: string;
  parentCategoryCode?: string;
};

export type ImageMime = "image/jpeg" | "image/png" | "image/tiff";

export type ImageFormat =
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
  altText?: string;
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

export type ClassificationWithFeatures = {
  code: ClassificationCode;
  features: Feature[];
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
  | "tilesAttributes"
  | "underlayAttributes"
  | string;

export type Feature = {
  code: FeatureCode;
  featureValues: readonly FeatureValue[];
  featureUnit?: FeatureUnit;
  name?: string;
};

export type FeatureCode =
  | "bmiClassificationCatalog/1.0/appearanceAttributes.colour"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily"
  | "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute"
  | "bmiClassificationCatalog/1.0/generalInformation.materials"
  | "bmiClassificationCatalog/1.0/generalInformation.productType"
  | "bmiClassificationCatalog/1.0/generalInformation.classification"
  | "bmiClassificationCatalog/1.0/measurements.length"
  | "bmiClassificationCatalog/1.0/measurements.width"
  | "bmiClassificationCatalog/1.0/measurements.height"
  | "bmiClassificationCatalog/1.0/measurements.thickness"
  | "bmiClassificationCatalog/1.0/measurements.volume"
  | "bmiClassificationCatalog/1.0/tilesAttributes.brokenBond"
  | "bmiClassificationCatalog/1.0/tilesAttributes.eaveGauge"
  | "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeStartAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeEndAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeEndAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeStartAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.maximumBattenSpacing"
  | "bmiClassificationCatalog/1.0/tilesAttributes.minimumBattenSpacing"
  | "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceStartAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceEndAngle"
  | "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpace"
  | "bmiClassificationCatalog/1.0/tilesAttributes.verticalOverlap"
  | "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOverlap"
  | "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOffset"
  | "bmiClassificationCatalog/1.0/tilesAttributes.snowFenceActive"
  | "bmiClassificationCatalog/1.0/tilesAttributes.largeTile"
  | "bmiClassificationCatalog/1.0/tilesAttributes.thicknessReduction"
  | "bmiClassificationCatalog/1.0/tilesAttributes.invert"
  | "bmiClassificationCatalog/1.0/tilesAttributes.invertY"
  | "bmiClassificationCatalog/1.0/underlayAttributes.overlap"
  | "bmiClassificationCatalog/1.0/underlayAttributes.minSupportedPitch"
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
  | "bmiClassificationCatalog/1.0/bimAttributes.productPageURL"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.MANUFACTURER"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER30"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER240"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.DOUANE"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.SECT"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.SECTU"
  | "bmiClassificationCatalog/1.0/fabDisProductInformation.MADE"
  | "bmiClassificationCatalog/1.0/fabDisPricingInformation.DATETARIF"
  | "bmiClassificationCatalog/1.0/fabDisPricingInformation.TARIFD"
  | "bmiClassificationCatalog/1.0/fabDisPricingInformation.QMC"
  | "bmiClassificationCatalog/1.0/fabDisPricingInformation.MUL"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.UB"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMC"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.MUL"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMVT"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.ST"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.DELAY"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.DATESTA"
  | "bmiClassificationCatalog/1.0/fabDisOrderInformation.DLSR"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.EDI"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFANT"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.DATEREC"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFE"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFNEW"
  | "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFOLD"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2L"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3"
  | "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3L"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.QCT"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.GTIN14"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUT"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUTU"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARG"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARGU"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROF"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROFU"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDS"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDSU"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOL"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOLU"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.CONSI"
  | "bmiClassificationCatalog/1.0/fabDisPackagingInformation.STACK"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.CODVAL"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.NUM"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.URL"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.URLT"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTYP"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNUM"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNAT"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RCOD"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNBR"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTEXTE"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RDATE"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVAL"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVU"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNOM"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURL"
  | "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURLT"
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

export type ReferenceTarget = {
  code: string;
  name?: string;
};

export type SystemReference = {
  referenceType: "CROSSELLING" | "UPSELLING";
  target: ReferenceTarget;
  preselected: boolean;
};

export type ProductReferenceType =
  | "HALF_TILE"
  | "ACCESSORIES"
  | "DOWN_PIPE"
  | "DOWN_PIPE_CONNECTOR"
  | "RIDGE_TILE"
  | "RIDGE_END_TILE"
  | "T_RIDGE"
  | "Y_RIDGE"
  | "LEFT_START"
  | "RIGHT_START"
  | "LEFT_VERGE_TILE"
  | "LEFT_VERGE_HALF_TILE"
  | "RIGHT_VERGE_TILE"
  | "RIGHT_VERGE_HALF_TILE"
  | "HIP"
  | "VALLEY_METAL_FLUSH_START"
  | "VALLEY_METAL_FLUSH"
  | "VALLEY_METAL_FLUSH_END"
  | "VALLEY_METAL_FLUSH_TOP"
  | "VALLEY_METAL_FLUSH_DORMER_START"
  | "EAVE_ACCESSORIES"
  | "VENTILATION_HOOD"
  | "CLIP"
  | "RIDGE_AND_HIP_SCREW"
  | "LONG_SCREW"
  | "SCREW"
  | "STORM_BRACKET"
  | "FINISHING_KIT"
  | "CROSSELLING"
  | "UPSELLING";

export type ProductReference = {
  referenceType: ProductReferenceType;
  target: ReferenceTarget;
  preselected: boolean;
};

export type VariantOption = {
  approvalStatus: ApprovalStatus;
  assets?: readonly Asset[];
  categoryAssets?: readonly Asset[];
  classifications?: readonly Classification[];
  code: string;
  externalProductCode?: string;
  images?: readonly Image[];
  isSampleOrderAllowed?: boolean;
  longDescription?: HTML;
  shortDescription: string;
  productBenefits?: string[];
  productReferences?: ProductReference[];
  name?: string;
  visualiserAssets?: readonly Asset[];
  keywords?: string[];
  seoDescription?: string;
  seoTags?: string[];
  seoTitle?: string;
};

export type BaseProduct = Pick<Product, "code" | "name">;

export enum GoodBetterBest {
  good = "GOOD",
  better = "BETTER",
  best = "BEST"
}

export type Product = {
  approvalStatus: ApprovalStatus;
  code: string;
  externalProductCode?: string;
  description: HTML;
  assets?: readonly Asset[];
  categoryAssets?: readonly Asset[];
  categories?: readonly Category[];
  classifications?: readonly Classification[];
  images?: readonly Image[];
  isSampleOrderAllowed?: boolean;
  longDescription: HTML;
  name?: string;
  productBenefits?: string[];
  shortDescription: string;
  summary: string;
  variantOptions?: readonly VariantOption[];
  productReferences?: ProductReference[];
  visualiserAssets?: readonly Asset[];
  keywords?: string[];
  seoDescription?: string;
  seoTags?: string[];
  seoTitle?: string;
  goodBetterBest?: GoodBetterBest;
};

export enum PimTypes {
  Products = "products",
  Systems = "systems"
}
