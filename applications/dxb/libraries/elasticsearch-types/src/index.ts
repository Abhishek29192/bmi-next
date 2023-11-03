import createCategory from "./CategoryHelper";
import createContentfulAssetType from "./ContentfulAssetTypeHelper";
import createContentfulDocument, {
  createFullyPopulatedContentfulDocument
} from "./ContentfulDocumentHelper";
import createContentfulImage, {
  createFullyPopulatedContenfulImage
} from "./ContentfulImageHelper";
import createPimProductDocument, {
  createFullyPopulatedPimProductDocument
} from "./PimProductDocumentHelper";
import createPimSystemDocument, {
  createFullyPopulatedPimSystemDocument
} from "./PimSystemDocumentHelper";
import createProduct from "./ProductHelper";
import createSystem from "./SystemHelper";
import { createTraining } from "./TrainingHelper";
import type {
  BattenSpacing,
  Category,
  ClassificationField,
  ContentfulAssetType,
  ContentfulDocument,
  ContentfulImage,
  Image,
  PimDocumentBase,
  PimProductDocument,
  PimSystemDocument,
  Product,
  ProductReference,
  System,
  SystemAttribute,
  Training
} from "./types";

export {
  createContentfulAssetType,
  createCategory,
  createContentfulDocument,
  createContentfulImage,
  createFullyPopulatedContentfulDocument,
  createFullyPopulatedContenfulImage,
  createFullyPopulatedPimProductDocument,
  createFullyPopulatedPimSystemDocument,
  createPimProductDocument,
  createPimSystemDocument,
  createProduct,
  createSystem,
  createTraining
};
export type {
  BattenSpacing,
  Category,
  ClassificationField,
  ContentfulAssetType,
  ContentfulDocument,
  ContentfulImage,
  Image,
  PimDocumentBase,
  PimProductDocument,
  PimSystemDocument,
  Product,
  ProductReference,
  System,
  SystemAttribute,
  Training
};
