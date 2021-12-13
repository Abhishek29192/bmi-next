import {
  Classification,
  ClassificationCodeEnum,
  Feature,
  FeatureCodeEnum
} from "../components/types/pim";

export type AttributeCodeMap = {
  [key in ClassificationCodeEnum]?: AttributeCode[];
};

export interface AttributeCode {
  attrName: string;
  separator?: string;
  fromStart?: boolean;
}

export const extractFeatureValuesByClassification = (
  classifications: Classification[],
  attributeCodeMap: AttributeCodeMap
): string[] => {
  const features: { [key in FeatureCodeEnum]?: Feature } =
    getClassificationFeaturesByFeatureCodes(classifications, attributeCodeMap);

  return Object.values(attributeCodeMap).reduce(
    (
      classificationFeatureValues: string[],
      attributeCodes: AttributeCode[]
    ) => {
      const featureValues: string[] = getFeatureValuesByCodes(
        features,
        attributeCodes
      );
      return [...classificationFeatureValues, ...featureValues];
    },
    []
  );
};

export const getFeatureValuesByCodes = (
  features: { [key in FeatureCodeEnum]?: Feature },
  attributeCodes: AttributeCode[]
): string[] => {
  return attributeCodes.reduce(
    (featureValues: string[], attributeCode: AttributeCode) => {
      const featureByFeatureCode: Feature = features[attributeCode.attrName];
      const separator = attributeCode.separator || "";
      if (
        featureByFeatureCode &&
        featureByFeatureCode.featureValues &&
        featureByFeatureCode.featureValues.length > 0 &&
        featureByFeatureCode.featureValues[0] &&
        featureByFeatureCode.featureValues[0].value
      ) {
        const featureValue = featureByFeatureCode.featureValues[0].value;
        const val = attributeCode.fromStart
          ? `${separator}${featureValue}`
          : `${featureValue}${separator}`;

        featureValues.push(val);
      }
      return separator ? [featureValues.join("")] : featureValues;
    },
    []
  );
};

export const getClassificationFeaturesByFeatureCodes = (
  classifications: Classification[],
  attributeCodeMap: AttributeCodeMap
): { [key in FeatureCodeEnum]?: Feature } => {
  return classifications.reduce(
    (
      classificationFeaturesByFeatureCodes: {
        [key in FeatureCodeEnum]?: Feature;
      },
      classification: Classification
    ) => {
      const featuresCodes = attributeCodeMap[classification.code];
      if (featuresCodes) {
        const classificationFeatures: { [key in FeatureCodeEnum]?: Feature } =
          featuresCodes.reduce(
            (
              classificationFeatures: { [key in FeatureCodeEnum]?: Feature },
              featuresCode: AttributeCode
            ) => {
              const classificationFeature = classification.features.find(
                (feature) =>
                  feature.code
                    .toLocaleLowerCase()
                    .endsWith(featuresCode.attrName)
              );
              if (classificationFeature) {
                classificationFeatures[featuresCode.attrName] =
                  classificationFeature;
              }
              return classificationFeatures;
            },
            {}
          );
        return {
          ...classificationFeaturesByFeatureCodes,
          ...classificationFeatures
        };
      }
      return classificationFeaturesByFeatureCodes;
    },
    {}
  );
};
