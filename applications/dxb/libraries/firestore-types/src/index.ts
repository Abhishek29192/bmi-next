import type {
  Asset,
  BIM,
  Brand,
  Category,
  CategoryImage,
  Classification,
  Document,
  Feature,
  FeatureCode,
  Filter,
  Image,
  KeyFeatures,
  Measurements,
  Mime,
  Product,
  ProductDocument,
  RelatedVariant,
  System,
  SystemDocument,
  SystemLayer,
  SystemReference,
  UnitValue,
  Video,
  Weight,
  CategoryGroup
} from "./types";
import {
  AwardAndCertificateAssetType,
  GuaranteesAndWarrantiesAssetType
} from "./types";
import createAsset from "./AssetHelper";
import createBrand from "./BrandHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import createDocument, {
  createProductDocument,
  createSystemDocument
} from "./DocumentHelper";
import createFeature from "./FeatureHelper";
import createFilter from "./FilterHelper";
import createImage from "./ImageHelper";
import createMeasurements from "./MeasurementsHelper";
import createProduct from "./ProductHelper";
import createRelatedVariant from "./RelatedVariantHelper";
import createVideo from "./VideoHelper";
import createWeight from "./WeightHelper";

export type {
  Asset,
  BIM,
  Brand,
  Category,
  CategoryImage,
  Classification,
  Document,
  Feature,
  FeatureCode,
  Filter,
  Image,
  KeyFeatures,
  Measurements,
  Mime,
  Product,
  ProductDocument,
  RelatedVariant,
  System,
  SystemDocument,
  SystemLayer,
  SystemReference,
  UnitValue,
  Weight,
  Video,
  CategoryGroup
};

export {
  AwardAndCertificateAssetType,
  createAsset,
  createBrand,
  createCategory,
  createClassification,
  createDocument,
  createFeature,
  createFilter,
  createImage,
  createMeasurements,
  createProduct,
  createProductDocument,
  createRelatedVariant,
  createSystemDocument,
  createVideo,
  createWeight,
  GuaranteesAndWarrantiesAssetType
};
