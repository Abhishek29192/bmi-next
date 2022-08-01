import createClassification, {
  createFeature,
  createFeatureValue
} from "./ClassificationHelper";
import createImage from "./ImageHelper";
import { VariantOption } from "./types";

export const createFullyPopulatedVariantOption = (
  variantOption?: Partial<VariantOption>
): VariantOption =>
  createVariantOption({
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
              createFeatureValue({ code: undefined, value: "10" })
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
            featureValues: [createFeatureValue({ value: "Shadow Black" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
            name: "Colour Family",
            featureValues: [createFeatureValue({ value: "Black" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
            name: "Texture Family",
            featureValues: [createFeatureValue({ value: "Gloss" })],
            featureUnit: undefined
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
            name: "Variant Attribute",
            featureValues: [
              createFeatureValue({ value: "Shadow Black Gloss 6x7x8x9x10" })
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
            featureValues: [createFeatureValue({ value: "Concrete" })],
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
            featureValues: [createFeatureValue({ code: undefined, value: "6" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.width",
            name: "Width",
            featureValues: [createFeatureValue({ code: undefined, value: "7" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.height",
            name: "Height",
            featureValues: [createFeatureValue({ code: undefined, value: "8" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.thickness",
            name: "Thickness",
            featureValues: [createFeatureValue({ code: undefined, value: "9" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/measurements.volume",
            name: "Volume",
            featureValues: [
              createFeatureValue({ code: undefined, value: "10" })
            ]
          })
        ]
      }),
      createClassification({
        code: "weightAttributes",
        name: "Weight",
        features: [
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
            name: "Gross Weight",
            featureValues: [createFeatureValue({ code: undefined, value: "6" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
            name: "Net Weight",
            featureValues: [createFeatureValue({ code: undefined, value: "7" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
            name: "Weight per Pallet",
            featureValues: [createFeatureValue({ code: undefined, value: "8" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
            name: "Weight per Piece",
            featureValues: [createFeatureValue({ code: undefined, value: "9" })]
          }),
          createFeature({
            code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
            name: "Weight per sq m",
            featureValues: [
              createFeatureValue({ code: undefined, value: "10" })
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
    ...variantOption
  });

const createVariantOption = (
  variantOption?: Partial<VariantOption>
): VariantOption => ({
  approvalStatus: "approved",
  classifications: [createClassification({ code: "variant-code" })],
  code: "variant-code",
  externalProductCode: "external-product-code",
  images: [createImage()],
  isSampleOrderAllowed: true,
  longDescription: "<p>Long description</p>",
  shortDescription: "Short description",
  productBenefits: ["product-benefits"],
  ...variantOption
});

export default createVariantOption;
