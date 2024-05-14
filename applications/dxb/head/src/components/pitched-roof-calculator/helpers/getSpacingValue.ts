import type { BattenSpacing } from "@bmi/elasticsearch-types";
import { convertToCentimeters } from "./convertToCentimeters";

export const getSpacingByPitch = (
  battenSpacings: BattenSpacing[],
  pitch: number
): { eaveGauge: number; maxBattenSpacing: number } => {
  const battenSpacing = battenSpacings.find(
    (batten) => batten.maxAngle >= pitch && batten.minAngle <= pitch
  );

  return {
    eaveGauge: convertToCentimeters(battenSpacing!.firstRowBattenDistance),
    maxBattenSpacing: convertToCentimeters(battenSpacing!.battenDistance)
  };
};
