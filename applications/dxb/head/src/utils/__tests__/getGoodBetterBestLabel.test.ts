import { microCopy } from "@bmi/microcopies";
import { GoodBetterBest } from "@bmi/pim-types";
import { getLevel, goodBetterBestLabels } from "../getGoodBetterBestLabel";

describe("goodBetterBestLabels", () => {
  it("returns label for good", () => {
    expect(goodBetterBestLabels[GoodBetterBest.good]).toEqual(
      microCopy.GOOD_BETTER_BEST_LABEL_GOOD
    );
  });

  it("returns label for better", () => {
    expect(goodBetterBestLabels[GoodBetterBest.better]).toEqual(
      microCopy.GOOD_BETTER_BEST_LABEL_BETTER
    );
  });

  it("returns label for best", () => {
    expect(goodBetterBestLabels[GoodBetterBest.best]).toEqual(
      microCopy.GOOD_BETTER_BEST_LABEL_BEST
    );
  });
});

describe("getLevel", () => {
  it("returns 'good' when goodBetterBest === 'GOOD'", () => {
    expect(getLevel(GoodBetterBest.good)).toBe("good");
  });

  it("returns 'better' when goodBetterBest === 'BETTER'", () => {
    expect(getLevel(GoodBetterBest.better)).toBe("better");
  });

  it("returns 'best' when goodBetterBest === 'BEST'", () => {
    expect(getLevel(GoodBetterBest.best)).toBe("best");
  });
});
