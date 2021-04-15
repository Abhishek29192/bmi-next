import { DimensionsValues } from "../types/roof";

const getPitchValues = (dimensions: DimensionsValues) =>
  Object.keys(dimensions)
    .filter((key) => key.startsWith("P"))
    .map((key) => parseFloat(dimensions[key] as string)); // All items which start with P are roof pitch values (e.g. P, P1, P2, etc...)

export default getPitchValues;
