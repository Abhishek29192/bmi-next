import { System } from "../../pim";
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
import { createSystemReference } from "./SystemReferencesHelper";

const createSystem = (system?: Partial<System>): System => ({
  type: "systemWsDTO",
  approvalStatus: "approved",
  code: "code",
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
  longDescription: "<p>Some very long description</p>",
  name: "name",
  shortDescription: "Short description",
  systemBenefits: [],
  systemLayers: [createSystemLayer()],
  systemReferences: [createSystemReference()],
  ...system
});

export default createSystem;
