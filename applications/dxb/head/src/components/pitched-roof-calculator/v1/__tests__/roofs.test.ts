import roofs from "../calculation/roofs";

// values that matches what all roofs may need
const measurementsUnion = {
  A: "9",
  B: "15",
  C: "5",
  D: "6",
  E: "7",
  P: "15",
  P1: "16",
  P2: "17",
  P3: "22"
};

describe("PitchedRoofCalculator roofs calculations", () => {
  it("calculates all roofs correctly", () => {
    const results = [];

    for (const roof of roofs) {
      results.push(roof.getMeasurements(measurementsUnion));
    }

    expect(results).toMatchSnapshot();
  });
});
