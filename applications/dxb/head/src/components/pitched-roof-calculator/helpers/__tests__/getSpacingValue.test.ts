import type { BattenSpacing } from "@bmi/elasticsearch-types";
import { getSpacingByPitch } from "../getSpacingValue";

const battenSpacing: BattenSpacing = {
  minAngle: 25,
  maxAngle: 45,
  battenDistance: {
    value: 330,
    unit: "mm"
  },
  firstRowBattenDistance: {
    value: 380,
    unit: "mm"
  }
};

describe("getSpacingByPitch helper", () => {
  it("returns correct values if the pitch value is between 25 and 45", () => {
    expect(getSpacingByPitch([battenSpacing], 35)).toEqual({
      eaveGauge: 38,
      maxBattenSpacing: 33
    });
  });

  it("returns correct values if the pitch value is set to the minimum allowed value", () => {
    expect(getSpacingByPitch([battenSpacing], 25)).toEqual({
      eaveGauge: 38,
      maxBattenSpacing: 33
    });
  });

  it("returns correct values if the pitch value is set to the maximum allowed value", () => {
    expect(getSpacingByPitch([battenSpacing], 45)).toEqual({
      eaveGauge: 38,
      maxBattenSpacing: 33
    });
  });
});
