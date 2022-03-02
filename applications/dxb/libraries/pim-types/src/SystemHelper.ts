import { System } from "./types";
import createAsset from "./AssetHelper";
import createCategory from "./CategoryHelper";
import {
  createAppearanceAttributesClassification,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification
} from "./ClassificationHelper";
import createImage from "./ImageHelper";
import { createSystemLayer } from "./SystemLayersHelper";
import createSystemReference from "./SystemReferencesHelper";

const createSystem = (system?: Partial<System>): System => ({
  type: "systemWsDTO",
  approvalStatus: "approved",
  code: "code",
  description: "<p>Some description</p>",
  assets: [createAsset()],
  categories: [
    createCategory({
      parentCategoryCode: "BMI_Brands",
      categoryType: "Brand",
      code: "BMI-brand-code"
    }),
    createCategory({ parentCategoryCode: "", code: "parent-category-code" }),
    createCategory(),
    createCategory({ categoryType: "ProductFamily" }),
    createCategory({ categoryType: "ProductLine" })
  ],
  classifications: [
    createScoringWeightAttributesClassification(),
    createAppearanceAttributesClassification(),
    createGeneralInformationClassification(),
    createMeasurementsClassification()
  ],
  images: [createImage()],
  longDescription: "<p>Some very long description</p>",
  name: "name",
  shortDescription: "Short description",
  systemBenefits: [],
  systemLayers: [createSystemLayer()],
  systemReferences: [createSystemReference()],
  ...system
});

export default createSystem;