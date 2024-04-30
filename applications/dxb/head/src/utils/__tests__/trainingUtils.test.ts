import { getPriceLabel } from "../trainingUtils";

describe("getPriceLabel", () => {
  it("returns fallback value if price is set to '0'", () => {
    expect(getPriceLabel("0", "€", "Free")).toBe("Free");
  });

  it("returns price if it is greater than 0", () => {
    expect(getPriceLabel("10", "€", "Free")).toBe("€10");
  });
});
