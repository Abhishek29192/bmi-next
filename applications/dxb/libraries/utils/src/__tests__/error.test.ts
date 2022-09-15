import { isError } from "../error";

describe("isError", () => {
  it("should return false if it is undefined", () => {
    expect(isError(undefined)).toEqual(false);
  });

  it("should return false if it is null", () => {
    expect(isError(null)).toEqual(false);
  });

  it("should return false if it does not have message property", () => {
    expect(isError({ something: "else" })).toEqual(false);
  });

  it("should return true if has message property", () => {
    expect(isError({ message: "Expected error" })).toEqual(true);
  });
});
