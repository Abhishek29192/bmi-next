import {
  createClassification,
  createImage,
  createProduct as createPimProduct
} from "@bmi/pim-types";
import createCategory from "./CategoryHelper";
import { Product } from "./types";

const createProduct = (product?: Partial<Product>): Product => ({
  description: "description",
  externalProductCode: "external-product-code",
  isSampleOrderAllowed: true,
  longDescription: "long-description",
  productBenefits: ["product", "benefits"],
  shortDescription: "short-description",
  summary: "summary",
  name: "name",
  code: "code",
  baseProduct: createPimProduct(),
  brandCode: "brand-code",
  images: [createImage()],
  allCategories: [createCategory()],
  classifications: [createClassification()],
  approvalStatus: "approved",
  productScoringWeightInt: 0,
  variantScoringWeightInt: 0,
  totalVariantCount: 1,
  mainImage: createImage().url,
  path: "name-code",
  subTitle: "",
  ...product
});

export default createProduct;
