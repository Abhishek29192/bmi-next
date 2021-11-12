import {
  Classification,
  Product,
  VariantOption
} from "../components/types/pim";
import { combineVariantClassifications } from "./filters";

type AttributeCodeMap = {
  [attributeName: string]: string[];
};

const generateUrl = (urlParts: string[]) => {
  return urlParts
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/\*/g, "")
    .replace(/"/g, "")
    .toLowerCase();
};

const extractFeatureValuesByClassification = (
  classifications: Classification[],
  attributeCodeMap: AttributeCodeMap
): string[] => {
  return classifications.reduce((urlFromClassifications, classification) => {
    const featuresCodes = attributeCodeMap[classification.code];
    if (featuresCodes) {
      const urlParamsFromClassificationFeatures = featuresCodes.reduce(
        (urlFromFeatures, featuresCode) => {
          const featureByFeatureCode = classification.features.find((feature) =>
            feature.code.toLocaleLowerCase().endsWith(featuresCode)
          );
          if (
            featureByFeatureCode &&
            featureByFeatureCode.featureValues &&
            featureByFeatureCode.featureValues.length > 0
          ) {
            const featureValue = featureByFeatureCode.featureValues[0].value;
            urlFromFeatures.push(featureValue);
          }
          return urlFromFeatures;
        },
        []
      );
      urlFromClassifications.push(...urlParamsFromClassificationFeatures);
    }
    return urlFromClassifications;
  }, []);
};

const generateVariantAttributeUrl = (
  productName: string,
  classifications: Classification[],
  productIdHash: string
): string => {
  const variantAttributeMap = {
    appearanceAttributes: ["variantattribute"]
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
    appearanceAttributes: ["colour", "texturefamily"],
    generalInformation: ["materials"]
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
