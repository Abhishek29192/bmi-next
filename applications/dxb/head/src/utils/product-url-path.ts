import {
  Classification,
  Product,
  VariantOption,
  ClassificationCodeEnum,
  FeatureCodeEnum,
  Feature
} from "../components/types/pim";
import { combineVariantClassifications } from "./filters";

export type AttributeCodeMap = {
  [key in ClassificationCodeEnum]?: AttributeCode[];
};

export interface AttributeCode {
  attrName: string;
  separator?: string;
  fromStart?: boolean;
}

export const generateUrl = (urlParts: string[]) => {
  return urlParts
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/_+/g, "-")
        .replace(/[^.,\s\p{L}\p{Nd}-]/gu, "")
        .replace(/\.+/g, "-")
        .replace(/,+/g, "-")
    )
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
};

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
      const featureValues: string[] = attributeCodes.reduce(
        (featureValues: string[], attributeCode: AttributeCode) => {
          const featureByFeatureCode: Feature =
            features[attributeCode.attrName];
          const separator = attributeCode.separator || "";
          if (
            featureByFeatureCode &&
            featureByFeatureCode.featureValues &&
            featureByFeatureCode.featureValues.length > 0 &&
            featureByFeatureCode.featureValues[0]
          ) {
            const featureValue = featureByFeatureCode.featureValues[0].value;
            if (featureValue) {
              const val = attributeCode.fromStart
                ? `${separator}${featureValue}`
                : `${featureValue}${separator}`;

              featureValues.push(val);
            }
          }
          return separator ? [featureValues.join("")] : featureValues;
        },
        []
      );
      return [...classificationFeatureValues, ...featureValues];
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

const generateVariantAttributeUrl = (
  productName: string,
  classifications: Classification[],
  productIdHash: string
): string => {
  const variantAttributeMap = {
    [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
      { attrName: FeatureCodeEnum.VARIANT_ATTRIBUTE }
    ]
  };
  const variantAttributePath = extractFeatureValuesByClassification(
    classifications,
    variantAttributeMap
  );
  if (variantAttributePath.length > 0) {
    return generateUrl([productName, ...variantAttributePath, productIdHash]);
  }
  return "";
};

const generateOtherAttributesUrl = (
  productName: string,
  classifications: Classification[],
  productIdHash: string
): string => {
  const featureAttributeMapForUrl = {
    [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
      { attrName: FeatureCodeEnum.COLOUR },
      { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
    ],
    [ClassificationCodeEnum.GENERAL_INFORMATION]: [
      { attrName: FeatureCodeEnum.MATERIALS }
    ]
  };

  const classificationsPath = extractFeatureValuesByClassification(
    classifications,
    featureAttributeMapForUrl
  );

  return generateUrl([productName, ...classificationsPath, productIdHash]);
};

// To opt-in to `variant attribute` url
// set useVariantAttribute to `true`
export const generateSimpleProductUrl = (
  baseProduct: Product,
  variant: VariantOption,
  productIdHash: string,
  useVariantAttribute: boolean
): string => {
  const productName = baseProduct.name;
  const classifications = combineVariantClassifications(baseProduct, variant);

  if (useVariantAttribute) {
    const variantAttributeUrl = generateVariantAttributeUrl(
      productName,
      classifications,
      productIdHash
    );
    if (variantAttributeUrl.length) {
      return variantAttributeUrl;
    }
  }

  return generateOtherAttributesUrl(
    productName,
    classifications,
    productIdHash
  );
};
