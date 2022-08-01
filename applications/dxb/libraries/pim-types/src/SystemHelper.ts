import createAsset from "./AssetHelper";
import createCategory from "./CategoryHelper";
import createClassification, {
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureValue,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification
} from "./ClassificationHelper";
import createImage from "./ImageHelper";
import { createSystemLayer } from "./SystemLayersHelper";
import createSystemReference from "./SystemReferencesHelper";
import { System } from "./types";

export const createFullyPopulatedSystem = (system?: Partial<System>): System =>
  createSystem({
    assets: [
      createAsset(),
      createAsset({ assetType: "AWARDS" }),
      createAsset({ assetType: "CERTIFICATES" }),
      createAsset({ assetType: "CERTIFICATES", allowedToDownload: false }),
      createAsset({ assetType: "CERTIFICATES", mime: undefined }),
      createAsset({
        assetType: "CERTIFICATES",
        fileSize: Number.MAX_VALUE
      }),
      createAsset({
        assetType: "CERTIFICATES",
        fileSize: undefined
      }),
      createAsset({
        assetType: "CERTIFICATES",
        realFileName: undefined
      }),
      createAsset({
        assetType: "CERTIFICATES",
        url: undefined
      }),
      createAsset({
        assetType: "CERTIFICATES",
        fileSize: undefined,
        realFileName: undefined
      }),
      createAsset({ assetType: "BIM" }),
      createAsset({ assetType: "GUARANTIES" }),
      createAsset({ assetType: "SPECIFICATION" }),
      createAsset({
        assetType: "VIDEO",
        url: "https://www.youtube.com/watch?v=3901c0ds7oo"
      }),
      createAsset({ assetType: "WARRANTIES" })
    ],
    categories: [createCategory({ categoryType: "Brand" })],
    classifications: [
      createClassification(),
      createClassification({
        code: "scoringWeightAttributes",
        name: "Scoring",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
            name: "Scoring Weight",
            featureValues: [
              createFeatureValue({ code: undefined, value: "100" })
            ]
          })
        ]
      }),
      createClassification({
        code: "systemAttributes",
        name: "System Attributes",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/systemAttributes.uniquesellingpropositions",
            name: "Unique Selling Propositions",
            featureValues: [
              createFeatureValue({ code: undefined, value: "USP 1" }),
              createFeatureValue({ code: undefined, value: "USP 2" })
            ]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/systemAttributes.promotionalcontent",
            name: "Promotional Content",
            featureValues: [
              createFeatureValue({
                code: undefined,
                value: "Promotional content value"
              })
            ]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/systemAttributes.keyfeatures",
            name: "Key Features",
            featureValues: [
              createFeatureValue({ code: undefined, value: "KF1" }),
              createFeatureValue({ code: undefined, value: "KF2" })
            ]
          })
        ]
      })
    ],
    images: [
      createImage(),
      createImage({
        assetType: "MASTER_IMAGE",
        format: "Product-Hero-Small-Desktop-Tablet"
      }),
      createImage({
        assetType: "MASTER_IMAGE",
        format: "Product-Color-Selector-Mobile"
      }),
      createImage({ assetType: "MASTER_IMAGE", format: undefined }),
      createImage({
        assetType: "GALLERY",
        format: "Product-Hero-Small-Desktop-Tablet"
      }),
      createImage({
        assetType: "GALLERY",
        format: "Product-Color-Selector-Mobile"
      }),
      createImage({ assetType: "GALLERY", format: undefined }),
      createImage({ format: "Web" }),
      createImage({ assetType: "TECHNICAL_DRAWINGS" })
    ],
    systemReferences: [
      createSystemReference({ referenceType: "CROSSELLING" as const }),
      createSystemReference({ referenceType: "UPSELLING" as const })
    ],
    systemLayers: [createSystemLayer()],
    ...system
  });

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
