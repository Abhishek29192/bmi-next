import {
  createCategory,
  createClassification,
  createImage,
  createProduct as createPimProduct
} from "@bmi/pim-types";
import { ProductVariant } from "../../es-model";

const createProductVariant = (productVariant?: Partial<ProductVariant>) => ({
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
  categories: [createCategory()],
  allCategories: [createCategory()],
  classifications: [createClassification()],
  measurementValue: "measurement-value",
  approvalStatus: "approved",
  ...productVariant
});

export default createProductVariant;
