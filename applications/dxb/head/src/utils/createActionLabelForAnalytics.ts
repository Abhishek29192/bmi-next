import {
  Classification,
  ClassificationCodeEnum
} from "../components/types/pim";
import {
  AttributeCodeMap,
  extractFeatureValuesByClassification
} from "./features-from-classifications-transfroms";

export const createActionLabel = (
  productName: string,
  classifications: Classification[],
  config: AttributeCodeMap
): string => {
  const measurementSymbol =
    classifications?.filter(
      ({ code }) => code === ClassificationCodeEnum.MEASUREMENTS
    )[0]?.features[0]?.featureUnit?.symbol || "";
  const classificationsPath = extractFeatureValuesByClassification(
    classifications,
    config
  );

  const result = [productName, ...classificationsPath]
    .filter(Boolean)
    .join("-")
    .replace(/(x)$/, measurementSymbol);
  return result;
};
