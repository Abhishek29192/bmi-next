import {
  ClassificationCodeEnum,
  Product,
  VariantOption
} from "../components/types/pim";
import { combineVariantClassifications } from "./filters";
import {
  AttributeCodeMap,
  extractFeatureValuesByClassification
} from "./product-url-path";

export const createActionLabel = (
  product: Product,
  selfProduct: VariantOption,
  config: AttributeCodeMap
): string => {
  const classifications = combineVariantClassifications(product, selfProduct);
  const measurementSymbol =
    classifications.filter(
      ({ code }) => code === ClassificationCodeEnum.MEASUREMENTS
    )[0]?.features[0]?.featureUnit?.symbol || "";
  const classificationsPath = extractFeatureValuesByClassification(
    classifications,
    config
  );

  const result = [product.name, ...classificationsPath]
    .join("-")
    .replace(/(x)$/, measurementSymbol);
  return result;
};
