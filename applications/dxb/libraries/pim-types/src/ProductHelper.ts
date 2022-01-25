import { Product } from "./types";
import createAsset from "./AssetHelper";
import createCategory from "./CategoryHelper";
import {
  createAppearanceAttributesClassification,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification
} from "./ClassificationHelper";
import createImage from "./ImageHelper";
import createVariantOption from "./VariantOptionHelper";

const createPimProduct = (product?: Partial<Product>): Product => ({
  approvalStatus: "approved",
  code: "code",
  externalProductCode: "external-product-code",
  description: "<p>Some description</p>",
  assets: [createAsset()],
  categories: [
    createCategory({ parentCategoryCode: "", code: "parent-category-code" }),
    createCategory(),
    createCategory({ categoryType: "ProductFamily" }),
    createCategory({ categoryType: "ProductLine" }),
    createCategory({ parentCategoryCode: "BMI_Brands", code: "BMI-brand-code" })
  ],
  classifications: [
    createScoringWeightAttributesClassification(),
    createAppearanceAttributesClassification(),
    createGeneralInformationClassification(),
    createMeasurementsClassification()
  ],
  images: [createImage()],
  isSampleOrderAllowed: true,
  longDescription: "<p>Some very long description</p>",
  name: "name",
  shortDescription: "Short description",
  summary: "Summary",
  variantOptions: [createVariantOption()],
  ...product
});

export default createPimProduct;
