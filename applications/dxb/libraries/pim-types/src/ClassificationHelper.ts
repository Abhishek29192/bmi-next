import { Classification, Feature, FeatureUnit, FeatureValue } from "./types";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

export const createFeatureValue = (
  featureValue?: Partial<FeatureValue>
): FeatureValue => ({
  value: "value",
  code: "code",
  ...featureValue
});

export const createFeatureUnit = (
  featureUnit?: Partial<FeatureUnit>
): FeatureUnit => ({
  name: "unit-name",
  symbol: "symbol",
  unitType: "unit-type",
  ...featureUnit
});

export const createFeature = (feature?: Partial<Feature>): Feature => ({
  code: "classification-feature-code",
  featureValues: [createFeatureValue()],
  featureUnit: createFeatureUnit(),
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
    features: [
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`,
        featureValues: [createFeatureValue({ value: "concrete" })]
      })
    ],
    ...classification,
    code: "generalInformation"
  });

export const createMeasurementsClassification = (
  classification?: Partial<Classification>
): Classification =>
  createClassification({
    features: [
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
        featureValues: [createFeatureValue({ value: "10" })],
        featureUnit: createFeatureUnit({
          name: "millimeter",
          symbol: "mm",
          unitType: "space"
        })
      }),
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
        featureValues: [createFeatureValue({ value: "20" })],
        featureUnit: createFeatureUnit({
          name: "millimeter",
          symbol: "mm",
          unitType: "space"
        })
      }),
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
        featureValues: [createFeatureValue({ value: "30" })],
        featureUnit: createFeatureUnit({
          name: "millimeter",
          symbol: "mm",
          unitType: "space"
        })
      }),
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.thickness`,
        featureValues: [createFeatureValue({ value: "40" })],
        featureUnit: createFeatureUnit({
          name: "millimeter",
          symbol: "mm",
          unitType: "space"
        })
      })
    ],
    ...classification,
    code: "measurements"
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
