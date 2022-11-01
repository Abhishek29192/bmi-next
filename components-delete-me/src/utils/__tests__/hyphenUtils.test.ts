import { transformHyphens } from "../hyphenUtils";

describe("transformHyphens function", () => {
  it("test string with hyphens", () => {
    expect(transformHyphens("long{-}long${-}title")).toBe(
      "long\u00ADlong$\u00ADtitle"
    );
  });

  it("test with null", () => {
    expect(transformHyphens(null)).toBe(null);
  });

  it("test with test string without hyphens", () => {
    expect(transformHyphens("test long sentence")).toBe("test long sentence");
  });

  it("test with empty string", () => {
    expect(transformHyphens("")).toBe("");
  });
});
