import dxbMarketPrefixes from "../siteUrlPrefixes.mjs";

describe("dxbMarketPrefixes array", () => {
  it("has 39 elements", () => {
    expect(dxbMarketPrefixes).toHaveLength(39);
  });

  it("elements are all lower-case", () => {
    expect(
      dxbMarketPrefixes.every((element) => element.toLowerCase() === element)
    ).toBeTruthy();
  });
});
