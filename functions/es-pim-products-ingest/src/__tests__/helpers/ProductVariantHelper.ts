import { ProductVariant } from "@bmi/es-model/src";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
import createImage from "./ImageHelper";
import createPimProduct from "./PimProductHelper";

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
  plpCategories: [createCategory()],
  classifications: [createClassification()],
  scoringWeight: "10",
  scoringWeightInt: 10,
  colourfamilyCode: "colour-family-code",
  colourfamilyValue: "colour-family-value",
  texturefamilyCode: "texture-family-code",
  texturefamilyValue: "texture-family-value",
  materialsCode: "materials-code",
  materialsValue: "materials-value",
  measurementValue: "measurement-value",
  approvalStatus: "approved",
  ...productVariant
});

export default createProductVariant;
