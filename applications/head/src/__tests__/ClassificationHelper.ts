import { Classification } from "../components/ProductBaseTypes";

const createClassification = (
  classification?: Partial<Classification>
): Classification => ({
  name: "classification-name",
  code: "classification-code",
  features: [
    {
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
      }
    }
  ],
  ...classification
});

export default createClassification;
