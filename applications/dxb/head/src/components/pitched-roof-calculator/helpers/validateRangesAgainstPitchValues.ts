import { RangeValue } from "../types";

const validateRangesAgainstPitchValues = (
  ranges: RangeValue[],
  pitchValues: number[]
): boolean =>
  pitchValues.every((pitch) =>
    ranges.some(({ start, end }) => start <= pitch && pitch < end)
  );

export default validateRangesAgainstPitchValues;
