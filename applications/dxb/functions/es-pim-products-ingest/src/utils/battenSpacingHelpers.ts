import { BattenSpacing } from "@bmi/elasticsearch-types";
import { Classification, Feature } from "@bmi/pim-types";

export const getBattenSpacings = (
  classifications: Classification[]
): BattenSpacing[] | undefined => {
  const tilesAttributes = classifications.find(
    (classification) => classification.code === "tilesAttributes"
  );

  if (!tilesAttributes?.features?.length) {
    return;
  }

  const battenSpacing1 = getBattenSpacingProperties(
    tilesAttributes.features,
    1
  );
  const battenSpacing2 = getBattenSpacingProperties(
    tilesAttributes.features,
    2
  );
  const battenSpacing3 = getBattenSpacingProperties(
    tilesAttributes.features,
    3
  );
  const battenSpacing4 = getBattenSpacingProperties(
    tilesAttributes.features,
    4
  );
  const battenSpacing5 = getBattenSpacingProperties(
    tilesAttributes.features,
    5
  );
  const battenSpacing6 = getBattenSpacingProperties(
    tilesAttributes.features,
    6
  );

  const filteredBattenSpacings = [
    battenSpacing1,
    battenSpacing2,
    battenSpacing3,
    battenSpacing4,
    battenSpacing5,
    battenSpacing6
  ].filter(getIsBattenSpacingCorrect);

  if (!filteredBattenSpacings.length) {
    return undefined;
  }

  return filteredBattenSpacings;
};

type PartialBattenSpacing = {
  minAngle?: number;
  maxAngle?: number;
  battenDistance?: { value: number; unit?: string };
  firstRowBattenDistance?: { value: number; unit?: string };
};

const getBattenSpacingProperties = (
  classificationFeatures: Feature[],
  index: number
): PartialBattenSpacing => {
  const battenSpacing: PartialBattenSpacing = {};

  classificationFeatures.forEach((feature) => {
    const featureCode = feature.code.split("/").pop()!;
    if (
      featureCode.toUpperCase() ===
      `tilesAttributes.roofPitch${index}Min`.toUpperCase()
    ) {
      battenSpacing.minAngle = Number(feature.featureValues[0].value);
    } else if (
      featureCode.toUpperCase() ===
      `tilesAttributes.roofPitch${index}Max`.toUpperCase()
    ) {
      battenSpacing.maxAngle = Number(feature.featureValues[0].value);
    } else if (
      featureCode.toUpperCase() ===
      `tilesAttributes.MaxBattenDistance${index}`.toUpperCase()
    ) {
      battenSpacing.battenDistance = {
        value: Number(feature.featureValues[0].value),
        unit: feature.featureUnit?.symbol
      };
    } else if (
      featureCode.toUpperCase() ===
      `tilesAttributes.FirstRowBattenDistance${index}`.toUpperCase()
    ) {
      battenSpacing.firstRowBattenDistance = {
        value: Number(feature.featureValues[0].value),
        unit: feature.featureUnit?.symbol
      };
    }
  });

  return battenSpacing;
};

const getIsBattenSpacingCorrect = (
  input: PartialBattenSpacing
): input is BattenSpacing => {
  return (
    !!input.minAngle &&
    !!input.maxAngle &&
    !!input.battenDistance?.value &&
    !!input.battenDistance?.unit &&
    !!input.firstRowBattenDistance?.value &&
    !!input.firstRowBattenDistance?.unit
  );
};
