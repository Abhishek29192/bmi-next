import { Classification, Feature, FeatureValue } from "../src/types/pim";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

export const createFeatureValue = (
  featureValue?: Partial<FeatureValue>
): FeatureValue => ({
  value: "value",
  code: "code",
  ...featureValue
});

export const createFeature = (feature?: Partial<Feature>): Feature => ({
  code: "classification-feature-code",
  featureValues: [createFeatureValue()],
  featureUnit: {
    symbol: "symbol"
  },
  name: "name",
  ...feature
});

export const createScoringWeightAttributesClassification = (
  classification?: Partial<Classification>
): Classification =>
  createClassification({
    features: [
      createFeature({ featureValues: [createFeatureValue({ value: "1.0" })] })
    ],
    ...classification,
    code: "scoringWeightAttributes"
  });

export const createAppearanceAttributesClassification = (
  classification?: Partial<Classification>
): Classification =>
  createClassification({
    features: [
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`,
        featureValues: [createFeatureValue({ value: "red" })]
      }),
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.texturefamily`,
        featureValues: [createFeatureValue({ value: "glossy" })]
      })
    ],
    ...classification,
    code: "appearanceAttributes"
  });

export const createGeneralInformationClassification = (
  classification?: Partial<Classification>
): Classification =>
  createClassification({
    ...classification,
    features: [
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`,
        featureValues: [createFeatureValue({ value: "concrete" })]
      })
    ],
    code: "generalInformation"
  });

const createClassification = (
  classification?: Partial<Classification>
): Classification => ({
  code: "code",
  features: [createFeature()],
  name: "name",
  ...classification
});

export default createClassification;
