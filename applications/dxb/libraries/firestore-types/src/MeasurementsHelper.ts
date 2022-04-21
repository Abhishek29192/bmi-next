import { Measurements } from "./types";

const createMeasurements = (
  measurements?: Partial<Measurements>
): Measurements => ({
  height: {
    unit: "symbol",
    value: "8"
  },
  label: "6x7x8symbol",
  length: {
    unit: "symbol",
    value: "6"
  },
  thickness: {
    unit: "symbol",
    value: "9"
  },
  volume: {
    unit: "symbol",
    value: "10"
  },
  width: {
    unit: "symbol",
    value: "7"
  },
  ...measurements
});

export default createMeasurements;
