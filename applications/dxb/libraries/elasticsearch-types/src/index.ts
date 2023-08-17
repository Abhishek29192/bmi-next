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
import type {
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
  SystemAttribute
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
  createSystem
};
export type {
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
  SystemAttribute
};
