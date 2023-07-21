import { GoodBetterBest } from "@bmi/pim-types";
import { getGoodBetterBestIcons } from "../getGoodBetterBestIcons";
import { createMockSiteData } from "../../test/mockSiteData";

describe("getGoodBetterBestIcons", () => {
  it("returns default icons", () => {
    const result = getGoodBetterBestIcons(undefined);
    expect(result).toStrictEqual({
      [GoodBetterBest.good]: "Thumb Up",
      [GoodBetterBest.better]: "Heart",
      [GoodBetterBest.best]: "Star"
    });
  });

  it("returns correct icons if resource exists", () => {
    const { resources } = createMockSiteData();

    const result = getGoodBetterBestIcons({
      ...resources,
      gbbBestIndicator: "Heart",
      gbbBetterIndicator: "Thumb Up",
      gbbGoodIndicator: "Star"
    });
    expect(result).toStrictEqual({
      [GoodBetterBest.good]: "Star",
      [GoodBetterBest.better]: "Thumb Up",
      [GoodBetterBest.best]: "Heart"
    });
  });
});
