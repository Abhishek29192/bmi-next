import { battenCalc } from "../calculate";
import { createTile } from "../../__tests__/helpers/createTile";
import type { Vertex } from "../../types/roof";

const vertices: Vertex[] = [
  {
    x: 0,
    y: 0
  },
  {
    x: 0,
    y: 1000
  },
  {
    x: 1500,
    y: 1000
  },
  {
    x: 1500,
    y: 0
  }
];

describe("battenCalc function", () => {
  it("returns correct number of battens", () => {
    expect(
      battenCalc(
        vertices,
        30,
        createTile({
          battenSpacings: [
            {
              minAngle: 1,
              maxAngle: 90,
              battenDistance: {
                value: 340,
                unit: "mm"
              },
              firstRowBattenDistance: {
                value: 380,
                unit: "mm"
              }
            }
          ]
        })
      ).length
    ).toBe(29);
  });
});
