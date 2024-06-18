import getPitchValues from "../getPitchValues";
import type { DimensionsValues } from "../../types/roof";

describe("getPitchValues helper", () => {
  it("returns correct pitch values if there are no protrusions", () => {
    expect(
      getPitchValues({
        A: "5",
        B: "15",
        C: "2",
        D: "3",
        E: "3",
        P1: "10",
        P2: "30"
      })
    ).toEqual([10, 30]);
  });

  it("returns correct pitch values if there are protrusions", () => {
    expect(
      getPitchValues({
        protrusions: [
          { type: "protrusion01", A: "3", B: "3", P: "45", roofPitch: "P1" }
        ],
        A: "5",
        B: "15",
        P: "10",
        P1: "30"
      } as unknown as DimensionsValues)
    ).toEqual([10, 30, 45]);
  });
});
