import { PIMDocumentProduct } from "../components/types/PIMDocumentBase";
import {
  Product,
  VariantOption,
  VariantOptionWithProduct
} from "../components/types/ProductBaseTypes";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import createPimDocument from "./PimDocumentHelper";
import createPimLinkDocument from "./PimLinkDocumentHelper";

const createProduct = (
  product?: Partial<PIMDocumentProduct>
): PIMDocumentProduct => ({
  code: "product-code",
  name: "product-name",
  categories: [createCategory()],
  classifications: [createClassification()],
  ...product
});

export const createBaseProduct = (product?: Partial<Product>): Product => {
  return {
    code: "product-code",
    externalProductCode: "external-product-code",
    name: "product-name",
    description: "product-description",
    images: [],
    assets: [],
    productBenefits: [],
    categories: [createCategory()],
    classifications: [createClassification()],
    variantOptions: [],
    documents: [createPimDocument(), createPimLinkDocument()],
    breadcrumbs: null,
    ...product
  };
};

export const createVariantOption = (
  variant?: Partial<VariantOption>
): VariantOption => {
  return {
    code: "variant-code",
    externalProductCode: "variant-product-code",
    isSampleOrderAllowed: true,
    images: null,
    classifications: null,
    approvalStatus: "approved",
    shortDescription: "variant-short-desc",
    longDescription: "variant-long-desc",
    breadcrumbs: [],
    path: "some-path",
    ...variant
  };
};

export const createVariantOptionWithProduct = (
  variantOptionWithProduct?: Partial<VariantOptionWithProduct>
): VariantOptionWithProduct => {
  return {
    ...createVariantOption(),
    _product: createBaseProduct(),
    ...variantOptionWithProduct
  };
};
export default createProduct;
