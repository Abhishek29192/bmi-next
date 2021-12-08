import {
  Classification,
  ClassificationCodeEnum,
  Feature
} from "../components/types/pim";

const createClassification = (
  classification?: Partial<Classification>
): Classification => ({
  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
  features: [createFeature()],
  ...classification
});

export const createFeature = (feature?: Partial<Feature>): Feature => ({
  name: "classification-feature-name",
  code: "classification-feature-code",
  featureValues: [
    {
      value: "classification-feature-feature-value-value",
      code: "classification-feature-feature-value-code"
    }
  ],
  featureUnit: {
    name: "classification-feature-feature-unit-name",
    symbol: "classification-feature-feature-unit-symbol",
    unitType: "classification-feature-feature-unit-unit-type"
  },
  ...feature
});

export default createClassification;
