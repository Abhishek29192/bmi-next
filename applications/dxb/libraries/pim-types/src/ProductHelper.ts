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
import { Product, VariantOption } from "./types";
import createVariantOption, {
  createFullyPopulatedVariantOption
} from "./VariantOptionHelper";

export const createFullyPopulatedProduct = (
  variantOptions: VariantOption[] = [createFullyPopulatedVariantOption()]
) =>
  createProduct({
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
      createAsset({ assetType: "FIXING_TOOL" }),
      createAsset({ assetType: "GUARANTIES" }),
      createAsset({ assetType: "SPECIFICATION" }),
      createAsset({
        assetType: "VIDEO",
        url: "https://www.youtube.com/watch?v=3901c0ds7oo"
      }),
      createAsset({ assetType: "WARRANTIES" })
    ],
    categories: [
      createCategory({ categoryType: "Brand" }),
      createCategory({
        categoryType: "Category",
        code: "parent-category",
        name: "Parent Category",
        parentCategoryCode: ""
      }),
      createCategory({
        categoryType: "Category",
        code: "child-category",
        name: "Child Category",
        parentCategoryCode: "parent-category"
      })
    ],
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
        code: "appearanceAttributes",
        name: "Appearance",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
            name: "Colour",
            featureValues: [createFeatureValue({ value: "Rustic Red" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
            name: "Colour Family",
            featureValues: [createFeatureValue({ value: "Red" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
            name: "Texture Family",
            featureValues: [createFeatureValue({ value: "Matt" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
            name: "Variant Attribute",
            featureValues: [
              createFeatureValue({ value: "Rustic Red Matt 1x2x3x4x5" })
            ],
            featureUnit: undefined
          })
        ]
      }),
      createClassification({
        code: "generalInformation",
        name: "General",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/generalInformation.materials",
            name: "Material",
            featureValues: [createFeatureValue({ value: "Clay" })],
            featureUnit: undefined
          })
        ]
      }),
      createClassification({
        code: "measurements",
        name: "Measurements",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.length",
            name: "Length",
            featureValues: [createFeatureValue({ code: undefined, value: "1" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.width",
            name: "width",
            featureValues: [createFeatureValue({ code: undefined, value: "2" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.height",
            name: "Height",
            featureValues: [createFeatureValue({ code: undefined, value: "3" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.thickness",
            name: "Thickness",
            featureValues: [createFeatureValue({ code: undefined, value: "4" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.volume",
            name: "Volume",
            featureValues: [createFeatureValue({ code: undefined, value: "5" })]
          })
        ]
      }),
      createClassification({
        code: "weightAttributes",
        name: "Weight",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
            featureValues: [createFeatureValue({ code: undefined, value: "1" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
            featureValues: [createFeatureValue({ code: undefined, value: "2" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
            featureValues: [createFeatureValue({ code: undefined, value: "3" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
            featureValues: [createFeatureValue({ code: undefined, value: "4" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
            featureValues: [createFeatureValue({ code: undefined, value: "5" })]
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
    variantOptions
  });

const createProduct = (product?: Partial<Product>): Product => ({
  approvalStatus: "approved",
  code: "base-code",
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

export default createProduct;
