import { convertStrToBool } from "../convertStrToBool";

describe("convertStrToBool", () => {
  it("should return true if argument is 'true'", () => {
    const result = convertStrToBool("true");
    expect(result).toEqual(true);
  });
  it("should return false if argument is 'false'", () => {
    const result = convertStrToBool("false");
    expect(result).toEqual(false);
  });
  it("should return false if argument is empty string", () => {
    const result = convertStrToBool("");
    expect(result).toEqual(false);
  });
  it("should return false if argument is string !== 'true'", () => {
    const result = convertStrToBool("test");
    expect(result).toEqual(false);
  });
});
