import type {
  Asset as PimAsset,
  AssetAssetType as PimAssetAssetType,
  Category as PimCategory,
  CategoryImage as PimCategoryImage,
  CategoryType,
  Mime as PimMime
} from "@bmi/pim-types";

export type System = {
  awardsAndCertificateDocuments: readonly Asset[];
  awardsAndCertificateImages: readonly Asset[];
  bim?: BIM;
  brand?: Brand;
  categories: readonly Category[];
  classifications: readonly Classification[];
  code: string;
  description?: string;
  documents: readonly SystemDocument[];
  guaranteesAndWarrantiesImages: readonly Asset[];
  guaranteesAndWarrantiesLinks: readonly Asset[];
  hashedCode: string;
  keyFeatures?: KeyFeatures;
  images: readonly Image[];
  layerCodes: string[];
  name: string;
  path: string;
  promotionalContent?: string;
  scoringWeight: number;
  shortDescription?: string;
  specification?: Asset;
  systemBenefits?: string[];
  systemLayers?: readonly SystemLayer[];
  systemReferences: readonly string[];
  uniqueSellingPropositions: readonly string[];
  videos: readonly Video[];
};

export type BIM = {
  name: string;
  url: string;
};

export type SystemLayer = {
  layerNumber: string;
  name: string;
  relatedProducts: readonly string[];
  relatedOptionalProducts: readonly string[];
  shortDescription?: string;
  type?: string;
};

export type SystemReference = {
  referenceType: string;
  target: {
    code: string;
  };
};

export type KeyFeatures = {
  name: string;
  values: readonly string[];
};

export enum GuaranteesAndWarrantiesAssetType {
  Links,
  Images
}

export enum AwardAndCertificateAssetType {
  Documents,
  Images
}

export type ApprovalStatus = "approved" | "discontinued";

export type Product = {
  approvalStatus: ApprovalStatus;
  awardsAndCertificateDocuments: readonly Asset[];
  awardsAndCertificateImages: readonly Asset[];
  baseCode: string;
  baseScoringWeight: number;
  bimIframeUrl?: string;
  brand?: Brand;
  categories: readonly Category[];
  classifications: readonly Classification[];
  code: string;
  colour?: string;
  colourMicrocopy?: string;
  colourFamily?: string;
  description: string;
  documents: readonly ProductDocument[];
  externalProductCode?: string;
  filters: readonly Filter[];
  fixingToolIframeUrl?: string;
  galleryImages: readonly Image[];
  groups: readonly CategoryGroup[];
  guaranteesAndWarrantiesImages: readonly Asset[];
  guaranteesAndWarrantiesLinks: readonly Asset[];
  masterImage?: Image;
  hashedCode: string;
  isSampleOrderAllowed: boolean;
  isVisualiserAvailable: boolean;
  materials?: string;
  measurements: Measurements;
  name: string;
  path: string;
  productBenefits?: readonly string[];
  relatedVariants: readonly RelatedVariant[];
  specificationIframeUrl?: string;
  techDrawings: readonly Image[];
  textureFamily?: string;
  textureFamilyMicrocopy?: string;
  variantAttribute?: string;
  videos: readonly Video[];
  weight: Weight;
};

export type Asset = PimAsset;
export type AssetAssetType = PimAssetAssetType;

export type Brand = {
  code: string;
  name?: string;
  logo?: string;
};

export type Category = PimCategory;

export type CategoryImage = PimCategoryImage;

export type Classification = {
  name: string;
  features: Feature[];
};

export type Feature = {
  name: string;
  value: string;
};

export type Filter = {
  filterCode: FeatureCode | CategoryType;
  name?: string;
  value: string;
  code: string;
  groupLabel?: string;
  parentFilterCode: string;
  unit?: string;
  isCategory: boolean;
};

export type FeatureCode =
  | "appearanceAttributes.colour"
  | "appearanceAttributes.texturefamily"
  | "appearanceAttributes.colourfamily"
  | "appearanceAttributes.variantattribute"
  | "generalInformation.materials"
  | "measurements.length"
  | "measurements.width"
  | "measurements.height"
  | "measurements.thickness"
  | "measurements.volume"
  | "scoringWeightAttributes.scoringweight"
  | "weightAttributes.netweight"
  | "weightAttributes.grossweight"
  | "weightAttributes.weightperpiece"
  | "weightAttributes.weightpersqm"
  | "weightAttributes.weightperpallet"
  | string;

export type Document = {
  assetType?: AssetAssetType;
  extension?: string;
  fileSize?: number;
  format?: Mime;
  id: string;
  isLinkDocument: boolean;
  realFileName?: string;
  title: string;
  url: string;
};

export type SystemDocument = Document;

export type ProductDocument = Document & {
  productBaseCode: string;
  productName: string;
};

export type Mime = PimMime;

export type Weight = {
  grossWeight?: UnitValue;
  netWeight?: UnitValue;
  weightPerPallet?: UnitValue;
  weightPerPiece?: UnitValue;
  weightPerSqm?: UnitValue;
};

export type UnitValue = { value: string; unit: string };

export type Measurements = {
  length?: UnitValue;
  width?: UnitValue;
  height?: UnitValue;
  thickness?: UnitValue;
  volume?: UnitValue;
  label: string;
};

export type RelatedVariant = {
  code: string;
  name: string;
  hashedCode: string;
  thumbnail?: string;
  colour?: string;
  colourFamily?: string;
  textureFamily?: string;
  materials?: string;
  measurements: Measurements;
  path: string;
  variantAttribute?: string;
};

export type Image = {
  mainSource?: string;
  thumbnail?: string;
  altText?: string;
};

export type Video = {
  title: "";
  label: string;
  subtitle: null;
  previewMedia: null;
  videoRatio: null;
  videoUrl: string;
};

export type CategoryGroup = { label: string; code: string };

export type YoutubeThumbnailDetail = {
  height?: number | null;
  url?: string | null;
  width?: number | null;
};

export type YoutubeDetails = {
  uploadStatus: string | undefined;
  thumbnails: {
    default?: YoutubeThumbnailDetail;
    medium?: YoutubeThumbnailDetail;
    high?: YoutubeThumbnailDetail;
    standard?: YoutubeThumbnailDetail;
    maxres?: YoutubeThumbnailDetail;
  };
  embedWidth: number;
  embedHeight: number;
};
