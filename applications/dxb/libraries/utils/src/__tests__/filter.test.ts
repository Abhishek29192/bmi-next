import { isDefined } from "../filter";

describe("isDefined", () => {
  it("returns false if undefined", () => {
    expect(isDefined(undefined)).toEqual(false);
  });

  it("returns false if null", () => {
    expect(isDefined(null)).toEqual(false);
  });

  it("returns true if zero", () => {
    expect(isDefined(0)).toEqual(true);
  });

  it("returns true if empty string", () => {
    expect(isDefined("")).toEqual(true);
  });
});
