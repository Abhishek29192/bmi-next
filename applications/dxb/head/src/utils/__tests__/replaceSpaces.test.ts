import { replaceSpaces } from "../transformHyphens";

describe("replaceSpaces function", () => {
  it("test string with spaces", () => {
    expect(replaceSpaces("long long title")).toBe("long-long-title");
  });

  it("test with null", () => {
    expect(replaceSpaces(null)).toBe("");
  });

  it("test with test string without spaces", () => {
    expect(replaceSpaces("test_long_sentence")).toBe("test_long_sentence");
  });

  it("test with undefined string", () => {
    expect(replaceSpaces(undefined)).toBe("");
  });

  it("test with empty string", () => {
    expect(replaceSpaces("")).toBe("");
  });
});
