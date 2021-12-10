import {
  Classification,
  Product,
  VariantOption,
  ClassificationCodeEnum,
  FeatureCodeEnum
} from "../components/types/pim";
import { extractFeatureValuesByClassification } from "./features-from-classifications-transfroms";
import { combineVariantClassifications } from "./filters";

export const generateUrl = (urlParts: string[]) => {
  return urlParts
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/_+/g, "-")
        .replace(/\/+/g, "-")
        .replace(/[^.,\s\p{L}\p{Nd}-]/gu, "")
        .replace(/\.+/g, "-")
        .replace(/,+/g, "-")
    )
    .join("-")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
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
