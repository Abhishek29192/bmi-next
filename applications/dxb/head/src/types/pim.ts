import {
  Asset as FirestoreAsset,
  AssetAssetType as FirestoreAssetType,
  BIM as FirestoreBIM,
  Brand as FirestoreBrand,
  Category as FirestoreCategory,
  CategoryGroup as FirestoreCategoryGroup,
  CategoryImage as FirestoreCategoryImage,
  Classification as FirestoreClassification,
  Feature as FirestoreFeature,
  Filter as FirestoreFilter,
  Image as FirestoreImage,
  KeyFeatures as FirestoreKeyFeatures,
  Measurements as FirestoreMeasurements,
  Mime,
  Product as FirestoreProduct,
  ProductDocument as FirestoreProductDocument,
  RelatedVariant as FirestoreRelatedVariant,
  System as FirestoreSystem,
  SystemDocument as FirestoreSystemDocument,
  SystemLayer as FirestoreSystemLayer,
  UnitValue,
  Video as FirestoreVideo
} from "@bmi/firestore-types";

export type BreadcrumbItem = {
  id: string;
  label: string;
  slug: string | null;
};

export type System = Omit<
  FirestoreSystem,
  | "bim"
  | "brand"
  | "categories"
  | "description"
  | "documents"
  | "keyFeatures"
  | "images"
  | "promotionalContent"
  | "shortDescription"
  | "specification"
  | "systemBenefits"
  | "systemLayers"
  | "videos"
> & {
  bim: BIM | null;
  brand: Brand | null;
  categories: readonly Category[];
  description: string | null;
  documents: readonly SystemDocument[];
  keyFeatures: KeyFeatures | null;
  images: readonly Image[];
  promotionalContent: string | null;
  shortDescription: string | null;
  specification: Asset | null;
  systemBenefits: string[] | null;
  systemLayers: readonly SystemLayer[] | null;
  videos: readonly Video[];
  relatedSystems: RelatedSystem[];
};

export type BIM = FirestoreBIM;

export type KeyFeatures = FirestoreKeyFeatures;

export type SystemLayer = Omit<
  FirestoreSystemLayer,
  "relatedProducts" | "relatedOptionalProducts" | "shortDescription" | "type"
> & {
  relatedProducts: Product[];
  relatedOptionalProducts: Product[];
  shortDescription: string | null;
  type: string | null;
};

export type Product = Omit<
  FirestoreProduct,
  | "bimIframeUrl"
  | "brand"
  | "categories"
  | "classifications"
  | "colour"
  | "colourFamily"
  | "externalProductCode"
  | "fixingToolIframeUrl"
  | "galleryImages"
  | "masterImage"
  | "materials"
  | "measurements"
  | "productBenefits"
  | "relatedVariants"
  | "specificationIframeUrl"
  | "techDrawings"
  | "textureFamily"
  | "variantAttribute"
  | "videos"
  | "weight"
> & {
  bimIframeUrl: string | null;
  brand: Brand | null;
  categories: readonly Category[];
  classifications: readonly Classification[];
  colour: string | null;
  colourFamily: string | null;
  externalProductCode: string | null;
  fixingToolIframeUrl: string | null;
  galleryImages: Image[];
  masterImage: Image | null;
  materials: string | null;
  // Can be null as Firestore doesn't store empty dictionaries
  measurements: Measurements | null;
  productBenefits: readonly string[] | null;
  productDocuments: readonly ProductDocumentResponse[];
  relatedVariants: readonly RelatedVariant[];
  specificationIframeUrl: string | null;
  techDrawings: readonly Image[];
  textureFamily: string | null;
  variantAttribute: string | null;
  videos: readonly Video[];
  // Can be null as Firestore doesn't store empty dictionaries
  weight: Weight | null;
  __typename: "Product";
  breadcrumbs: BreadcrumbItem[];
  keyAssetDocuments: KeyAssetDocument[] | null;
  oldPath: string;
  path: string;
  relatedProducts: RelatedProduct[];
  isVisualiserAvailable: boolean | null;
};

export type KeyAssetDocument = {
  assetType: string;
  documents: ProductDocument[];
};

export type Asset = Omit<FirestoreAsset, "assetType" | "mime" | "format"> & {
  assetType: FirestoreAssetType | null;
  format: string | null;
  mime: Mime | null;
};

export type Brand = Omit<FirestoreBrand, "logo"> & {
  logo: string | null;
};

export type Category = Omit<
  FirestoreCategory,
  "name" | "image" | "parentCategoryCode"
> & {
  name: string | null;
  image: CategoryImage | null;
  parentCategoryCode: string | null;
};

export type CategoryImage = FirestoreCategoryImage;

export type Classification = FirestoreClassification;

export type Feature = FirestoreFeature;

export type ProductDocumentResponse = ProductDocument | PseudoZipPIMDocument;

export type SystemDocument = Omit<
  FirestoreSystemDocument,
  "assetType" | "realFileName" | "fileSize" | "format"
> & {
  assetType: AssetType;
  realFileName: string | null;
  fileSize: number | null;
  format: Mime | null;
  extension: string | null;
  __typename: "PIMSystemDocument";
};

export type ProductDocument = Omit<
  FirestoreProductDocument,
  "assetType" | "realFileName" | "fileSize" | "format" | "extension"
> & {
  assetType: AssetType;
  realFileName: string | null;
  fileSize: number | null;
  format: Mime | null;
  extension: string | null;
  __typename: "PIMDocument";
  // TODO: remove when document filtering is done with Elastic search
  productFilters: ProductDocumentFilter[];
};

export type ProductDocumentFilter = Pick<
  Filter,
  "code" | "filterCode" | "value"
>;

export type PseudoZipPIMDocument = {
  __typename: "PIMDocumentWithPseudoZip";
  assetType: AssetType;
  documentList: ProductDocument[];
  fileSize: number;
  format: "application/zip";
  id: string;
  isLinkDocument: false;
  productBaseCode: string;
  productName: string;
  title: string;
};

export type RelatedProduct = Pick<
  Product,
  | "baseCode"
  | "baseScoringWeight"
  | "brand"
  | "code"
  | "colour"
  | "colourFamily"
  | "externalProductCode"
  | "masterImage"
  | "measurements"
  | "textureFamily"
  | "name"
  | "path"
> & {
  groups: readonly FirestoreCategoryGroup[];
};

export type AssetType = {
  code: string;
  pimCode: string | null;
  name: string;
  id: string;
};

export type Image = Omit<
  FirestoreImage,
  "mainSource" | "thumbnail" | "altText"
> & {
  mainSource: string | null;
  thumbnail: string | null;
  altText: string | null;
};

export type Measurements = Omit<
  FirestoreMeasurements,
  "length" | "width" | "height" | "thickness" | "volume"
> & {
  length: UnitValue | null;
  width: UnitValue | null;
  height: UnitValue | null;
  thickness: UnitValue | null;
  volume: UnitValue | null;
};

export type RelatedVariant = Omit<
  FirestoreRelatedVariant,
  | "thumbnail"
  | "colour"
  | "colourFamily"
  | "textureFamily"
  | "materials"
  | "measurements"
  | "variantAttribute"
> & {
  thumbnail: string | null;
  colour: string | null;
  colourFamily: string | null;
  textureFamily: string | null;
  materials: string | null;
  measurements: Measurements | null;
  variantAttribute: string | null;
  path: string;
};

export type Weight = {
  grossWeight: UnitValue | null;
  netWeight: UnitValue | null;
  weightPerPallet: UnitValue | null;
  weightPerPiece: UnitValue | null;
  weightPerSqm: UnitValue | null;
};

export type Video = FirestoreVideo & {
  __typename: "PimVideo";
  defaultYouTubePreviewImage: string;
};

export type RelatedSystem = Pick<
  System,
  "code" | "images" | "name" | "path" | "scoringWeight" | "shortDescription"
> & {
  brand: Pick<Brand, "code"> | null;
};

export type Filter = Omit<FirestoreFilter, "groupLabel" | "unit"> & {
  groupLabel: string | null;
  unit: string | null;
};

export type ProductFilterOption = {
  label: string;
  value: string;
};

export type ProductFilter = {
  filterCode: string | undefined;
  label: string;
  name: string | null;
  options: ProductFilterOption[];
  value?: string[];
};

export type PLPFilterResponse = {
  filters: ProductFilter[];
  allowFilterBy: string[] | undefined;
};
