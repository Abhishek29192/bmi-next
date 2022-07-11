import {
  Classification,
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue
} from "@bmi/pim-types";
import {
  TwoOneClassToIgnore,
  TwoOneIgnoreDictionary
} from "../../transformProducts";

export const createTwoOneClassifications = (
  pimClassificationNamepspace: string | undefined = process.env
    .PIM_CLASSIFICATION_CATALOGUE_NAMESPACE
): Classification[] => {
  return Object.keys(TwoOneIgnoreDictionary).map((classificationKey) => {
    const classification: Classification = {
      code: classificationKey,
      name: classificationKey
    };
    // eslint-disable-next-line security/detect-object-injection
    const featuresToIgnore = TwoOneIgnoreDictionary[classificationKey].map(
      (attributeKey) => {
        return createFeature({
          code: `${pimClassificationNamepspace}/${classificationKey}.${attributeKey}`,
          featureValues: [
            createFeatureValue({ value: `${attributeKey}-value` })
          ],
          featureUnit: createFeatureUnit({
            name: "featureUnit",
            symbol: "N",
            unitType: "Newton"
          })
        });
      }
    );
    classification.features = featuresToIgnore;

    return classification;
  });
};

export const createTwoOneClassification = (
  pimClassificationNamepspace: string | undefined = process.env
    .PIM_CLASSIFICATION_CATALOGUE_NAMESPACE,
  twoOneClassificationKey: TwoOneClassToIgnore
): Classification => {
  // eslint-disable-next-line security/detect-object-injection
  const twoOneClassResult = TwoOneIgnoreDictionary[twoOneClassificationKey];
  if (twoOneClassResult) {
    const classification: Classification = {
      code: twoOneClassificationKey,
      name: twoOneClassificationKey
    };
    const featuresToIgnore = twoOneClassResult.map((attributeKey) => {
      return createFeature({
        code: `${pimClassificationNamepspace}/${twoOneClassificationKey}.${attributeKey}`,
        featureValues: [createFeatureValue({ value: `${attributeKey}-value` })],
        featureUnit: createFeatureUnit({
          name: "featureUnit",
          symbol: "N",
          unitType: "Newton"
        })
      });
    });
    classification.features = featuresToIgnore;
    return classification;
  }
  return createClassification();
};
