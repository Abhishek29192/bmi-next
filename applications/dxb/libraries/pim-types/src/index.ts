import createAsset from "./AssetHelper";
import createCategory from "./CategoryHelper";
import createClassification, {
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification
} from "./ClassificationHelper";
import createIgnorableClassifications from "./createIgnorableClassifications";
import createImage from "./ImageHelper";
import createProduct, { createFullyPopulatedProduct } from "./ProductHelper";
import createProductsApiResponse from "./ProductsApiResonseHelper";
import createSystem, { createFullyPopulatedSystem } from "./SystemHelper";
import {
  createSystemLayer,
  createSystemLayerProducts
} from "./SystemLayersHelper";
import createSystemReference from "./SystemReferencesHelper";
import createSystemsApiResponse from "./SystemsApiResponseHelper";
import type {
  ApprovalStatus,
  Asset,
  AssetAssetType,
  AuthResponse,
  BaseProduct,
  CatalogVersion,
  Category,
  CategoryImage,
  CategoryType,
  Classification,
  ClassificationCode,
  ErrorResponse,
  Feature,
  FeatureCode,
  FeatureUnit,
  FeatureValue,
  Image,
  ImageAssetType,
  ImageMime,
  Mime,
  PimTypes,
  Product,
  ProductsApiResponse,
  System,
  SystemLayer,
  SystemReference,
  SystemReferenceTarget,
  SystemsApiResponse,
  VariantOption
} from "./types";
import createVariantOption, {
  createFullyPopulatedVariantOption
} from "./VariantOptionHelper";

export {
  createAsset,
  createCategory,
  createClassification,
  createFeatureValue,
  createFeatureUnit,
  createFeature,
  createIgnorableClassifications,
  createScoringWeightAttributesClassification,
  createAppearanceAttributesClassification,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createImage,
  createProduct,
  createFullyPopulatedProduct,
  createProductsApiResponse,
  createSystem,
  createFullyPopulatedSystem,
  createSystemLayer,
  createSystemLayerProducts,
  createSystemReference,
  createSystemsApiResponse,
  createVariantOption,
  createFullyPopulatedVariantOption
};
export type {
  ApprovalStatus,
  Asset,
  AssetAssetType,
  AuthResponse,
  CatalogVersion,
  Category,
  CategoryImage,
  CategoryType,
  Classification,
  ClassificationCode,
  ErrorResponse,
  Feature,
  FeatureCode,
  FeatureUnit,
  FeatureValue,
  Image,
  ImageAssetType,
  ImageMime,
  Mime,
  PimTypes,
  Product,
  ProductsApiResponse,
  System,
  SystemLayer,
  SystemReference,
  SystemReferenceTarget,
  SystemsApiResponse,
  VariantOption,
  BaseProduct
};
